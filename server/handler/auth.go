package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/labstack/echo/v4"
)

const oauthStateTTL = 10 * time.Minute

// generateState returns a self-contained, HMAC-signed OAuth state token that
// embeds an expiry timestamp. It needs no server-side storage, so it works
// across replicas and survives restarts.
func (h *Handler) generateState() string {
	payload := strconv.FormatInt(time.Now().Add(oauthStateTTL).Unix(), 10)
	return payload + "." + signState(payload, h.JWTSecret)
}

// validateState verifies the signature and expiry of an OAuth state token.
func (h *Handler) validateState(s string) bool {
	payload, sig, ok := strings.Cut(s, ".")
	if !ok {
		return false
	}
	exp, err := strconv.ParseInt(payload, 10, 64)
	if err != nil {
		return false
	}
	if time.Now().Unix() > exp {
		return false
	}
	return hmac.Equal([]byte(sig), []byte(signState(payload, h.JWTSecret)))
}

func signState(payload, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	return hex.EncodeToString(mac.Sum(nil))
}

// HandleGitHubLogin redirects the user to the GitHub App OAuth authorization page.
func (h *Handler) HandleGitHubLogin(c echo.Context) error {
	return c.Redirect(http.StatusTemporaryRedirect, h.GHConfig.AuthCodeURL(h.generateState()))
}

// HandleGitHubCallback handles the OAuth callback from GitHub App.
// It exchanges the code for a user access token, fetches the user profile,
// issues a session JWT, and closes the popup.
func (h *Handler) HandleGitHubCallback(c echo.Context) error {
	state := c.QueryParam("state")
	if !h.validateState(state) {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid or expired OAuth state")
	}

	code := c.QueryParam("code")
	if code == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "missing code parameter")
	}

	userToken, err := h.GHConfig.ExchangeCode(c.Request().Context(), code)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to exchange OAuth code")
	}

	user, err := github.GetUser(c.Request().Context(), userToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to fetch GitHub user")
	}

	// The JWT only carries identity — no GitHub token stored in it.
	// Issue creation uses a server-side installation token instead.
	jwtToken, err := middleware.IssueToken(h.JWTSecret, user.Login, user.AvatarURL)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to issue session token")
	}

	tokJSON, _ := json.Marshal(jwtToken)
	loginJSON, _ := json.Marshal(user.Login)
	avatarJSON, _ := json.Marshal(user.AvatarURL)
	html := `<!DOCTYPE html><html><body><script>
if(window.opener){
  window.opener.postMessage({type:'feedback_overlay_auth',token:` + string(tokJSON) + `,login:` + string(loginJSON) + `,avatar:` + string(avatarJSON) + `},'*');
}
window.close();
</script></body></html>`

	return c.HTML(http.StatusOK, html)
}

// HandleMe returns the authenticated user's profile.
func (h *Handler) HandleMe(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"login":      middleware.GetLogin(c),
		"avatar_url": c.Get("avatar_url").(string),
	})
}
