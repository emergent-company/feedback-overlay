package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"sync"
	"time"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/labstack/echo/v4"
)

// stateStore is a simple in-memory map of OAuth state → expiry.
// In production with multiple replicas you'd use Redis or a DB; for a
// single-instance deployment this is fine.
var (
	statesMu sync.Mutex
	states   = map[string]time.Time{}
)

func generateState() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func storeState(s string) {
	statesMu.Lock()
	defer statesMu.Unlock()
	// Prune expired states while we're here.
	for k, exp := range states {
		if time.Now().After(exp) {
			delete(states, k)
		}
	}
	states[s] = time.Now().Add(10 * time.Minute)
}

func validateAndConsumeState(s string) bool {
	statesMu.Lock()
	defer statesMu.Unlock()
	exp, ok := states[s]
	if !ok || time.Now().After(exp) {
		return false
	}
	delete(states, s)
	return true
}

// HandleGitHubLogin redirects the user (or popup) to GitHub OAuth.
func (h *Handler) HandleGitHubLogin(c echo.Context) error {
	state := generateState()
	storeState(state)
	return c.Redirect(http.StatusTemporaryRedirect, h.GHConfig.AuthCodeURL(state))
}

// HandleGitHubCallback handles the OAuth callback from GitHub.
// It exchanges the code for a token, fetches the user, issues a JWT, and
// closes the popup by returning an HTML page that posts a message to the opener.
func (h *Handler) HandleGitHubCallback(c echo.Context) error {
	state := c.QueryParam("state")
	if !validateAndConsumeState(state) {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid or expired OAuth state")
	}

	code := c.QueryParam("code")
	if code == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "missing code parameter")
	}

	oauthToken, err := h.GHConfig.ExchangeCode(c.Request().Context(), code)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to exchange OAuth code")
	}

	user, err := github.GetUser(c.Request().Context(), oauthToken.AccessToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to fetch GitHub user")
	}

	jwt, err := middleware.IssueToken(h.JWTSecret, user.Login, user.AvatarURL, oauthToken.AccessToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to issue session token")
	}

	// Return an HTML page that communicates back to the opener and closes itself.
	html := `<!DOCTYPE html><html><body><script>
if(window.opener){
  window.opener.postMessage({type:'feedback_overlay_auth',token:'` + jwt + `',login:'` + user.Login + `',avatar:'` + user.AvatarURL + `'},'*');
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
