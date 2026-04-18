package github

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"golang.org/x/oauth2"
)

const (
	authURL  = "https://github.com/login/oauth/authorize"
	tokenURL = "https://github.com/login/oauth/access_token"
	apiBase  = "https://api.github.com"
)

// Config holds the GitHub OAuth App credentials.
type Config struct {
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

// OAuthConfig returns the golang.org/x/oauth2 config for the GitHub OAuth flow.
func (c *Config) OAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     c.ClientID,
		ClientSecret: c.ClientSecret,
		RedirectURL:  c.RedirectURI,
		Scopes:       []string{"public_repo", "repo"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  authURL,
			TokenURL: tokenURL,
		},
	}
}

// AuthCodeURL builds the GitHub OAuth redirect URL with state.
func (c *Config) AuthCodeURL(state string) string {
	return c.OAuthConfig().AuthCodeURL(state, oauth2.AccessTypeOnline)
}

// ExchangeCode exchanges an OAuth code for an access token.
func (c *Config) ExchangeCode(ctx context.Context, code string) (*oauth2.Token, error) {
	return c.OAuthConfig().Exchange(ctx, code)
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

// CreateIssue creates a GitHub issue in the given repo using the user's access token.
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
