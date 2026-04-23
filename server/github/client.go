package github

import (
	"bytes"
	"context"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const apiBase = "https://api.github.com"

// AppConfig holds GitHub App credentials.
type AppConfig struct {
	AppID          string
	ClientID       string
	ClientSecret   string
	RedirectURI    string
	PrivateKeyPEM  string // RSA private key in PEM format
	InstallationID string // numeric installation ID on the target org/account
}

// privateKey parses the RSA private key from PEM.
func (c *AppConfig) privateKey() (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(c.PrivateKeyPEM))
	if block == nil {
		return nil, fmt.Errorf("github app: failed to decode PEM block")
	}
	key, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("github app: parse private key: %w", err)
	}
	return key, nil
}

// appJWT creates a short-lived JWT signed with the App's private key.
// GitHub requires this to authenticate as the App itself.
func (c *AppConfig) appJWT() (string, error) {
	key, err := c.privateKey()
	if err != nil {
		return "", err
	}
	now := time.Now()
	claims := jwt.RegisteredClaims{
		IssuedAt:  jwt.NewNumericDate(now.Add(-30 * time.Second)), // allow clock skew
		ExpiresAt: jwt.NewNumericDate(now.Add(9 * time.Minute)),
		Issuer:    c.AppID,
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return tok.SignedString(key)
}

// installationToken caches a short-lived installation access token.
var (
	instTokenMu      sync.Mutex
	instTokenVal     string
	instTokenExpires time.Time
)

// InstallationToken returns a valid installation access token, refreshing if needed.
func (c *AppConfig) InstallationToken(ctx context.Context) (string, error) {
	instTokenMu.Lock()
	defer instTokenMu.Unlock()

	if instTokenVal != "" && time.Now().Before(instTokenExpires.Add(-2*time.Minute)) {
		return instTokenVal, nil
	}

	appTok, err := c.appJWT()
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/app/installations/%s/access_tokens", apiBase, c.InstallationID)
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, url, nil)
	req.Header.Set("Authorization", "Bearer "+appTok)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("github app: get installation token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		var gh struct{ Message string `json:"message"` }
		_ = json.NewDecoder(resp.Body).Decode(&gh)
		return "", fmt.Errorf("github app: get installation token: status %d: %s", resp.StatusCode, gh.Message)
	}

	var result struct {
		Token     string    `json:"token"`
		ExpiresAt time.Time `json:"expires_at"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("github app: decode installation token: %w", err)
	}

	instTokenVal = result.Token
	instTokenExpires = result.ExpiresAt
	return instTokenVal, nil
}

// AuthCodeURL builds the GitHub App OAuth authorization URL.
// GitHub Apps use a slightly different URL from OAuth Apps.
func (c *AppConfig) AuthCodeURL(state string) string {
	v := url.Values{}
	v.Set("client_id", c.ClientID)
	v.Set("redirect_uri", c.RedirectURI)
	v.Set("state", state)
	return "https://github.com/login/oauth/authorize?" + v.Encode()
}

// ExchangeCode exchanges an authorization code for a user access token.
func (c *AppConfig) ExchangeCode(ctx context.Context, code string) (string, error) {
	body, _ := json.Marshal(map[string]string{
		"client_id":     c.ClientID,
		"client_secret": c.ClientSecret,
		"code":          code,
		"redirect_uri":  c.RedirectURI,
	})

	req, _ := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://github.com/login/oauth/access_token", bytes.NewReader(body))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("github app: exchange code: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		AccessToken string `json:"access_token"`
		Error       string `json:"error"`
		ErrorDesc   string `json:"error_description"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("github app: decode token response: %w", err)
	}
	if result.Error != "" {
		return "", fmt.Errorf("github app: exchange code: %s: %s", result.Error, result.ErrorDesc)
	}
	return result.AccessToken, nil
}

// User fetches the authenticated GitHub user's login and avatar.
type User struct {
	Login     string `json:"login"`
	AvatarURL string `json:"avatar_url"`
	Name      string `json:"name"`
}

// GetUser fetches the user profile for the given access token.
func GetUser(ctx context.Context, accessToken string) (User, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, apiBase+"/user", nil)
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return User{}, fmt.Errorf("github: get user: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return User{}, fmt.Errorf("github: get user: status %d", resp.StatusCode)
	}
	var u User
	if err := json.NewDecoder(resp.Body).Decode(&u); err != nil {
		return User{}, fmt.Errorf("github: decode user: %w", err)
	}
	return u, nil
}

// CreateIssueParams holds the data for creating a GitHub issue.
type CreateIssueParams struct {
	Repo   string // "owner/repo"
	Title  string
	Body   string
	Labels []string
}

// CreateIssueResponse is the minimal response from the GitHub Issues API.
type CreateIssueResponse struct {
	HTMLURL string `json:"html_url"`
	Number  int    `json:"number"`
}

// CreateIssue creates a GitHub issue using the provided token.
func CreateIssue(ctx context.Context, accessToken string, p CreateIssueParams) (CreateIssueResponse, error) {
	parts := strings.SplitN(p.Repo, "/", 2)
	if len(parts) != 2 {
		return CreateIssueResponse{}, fmt.Errorf("github: invalid repo %q (want owner/repo)", p.Repo)
	}

	payload := map[string]any{
		"title":  p.Title,
		"body":   p.Body,
		"labels": p.Labels,
	}
	body, _ := json.Marshal(payload)

	url := fmt.Sprintf("%s/repos/%s/%s/issues", apiBase, parts[0], parts[1])
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return CreateIssueResponse{}, fmt.Errorf("github: create issue: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusCreated {
		var gh struct{ Message string `json:"message"` }
		_ = json.NewDecoder(resp.Body).Decode(&gh)
		return CreateIssueResponse{}, fmt.Errorf("github: create issue: status %d: %s", resp.StatusCode, gh.Message)
	}
	var result CreateIssueResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return CreateIssueResponse{}, fmt.Errorf("github: decode issue response: %w", err)
	}
	return result, nil
}
