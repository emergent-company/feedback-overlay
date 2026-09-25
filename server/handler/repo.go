package handler

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"errors"
	"net/http"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/labstack/echo/v4"
)

// tokenEncryptKey derives an AES-256 key from the JWT secret (domain-separated).
func tokenEncryptKey(jwtSecret string) []byte {
	sum := sha256.Sum256([]byte("feedback-overlay:token:" + jwtSecret))
	return sum[:]
}

func encryptToken(plain, jwtSecret string) ([]byte, error) {
	block, err := aes.NewCipher(tokenEncryptKey(jwtSecret))
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}
	return gcm.Seal(nonce, nonce, []byte(plain), nil), nil
}

func decryptToken(encrypted []byte, jwtSecret string) (string, error) {
	block, err := aes.NewCipher(tokenEncryptKey(jwtSecret))
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	ns := gcm.NonceSize()
	if len(encrypted) < ns {
		return "", errors.New("token ciphertext too short")
	}
	plain, err := gcm.Open(nil, encrypted[:ns], encrypted[ns:], nil)
	if err != nil {
		return "", err
	}
	return string(plain), nil
}

// HandleListRepos handles GET /api/repos — lists the user's GitHub repos.
func (h *Handler) HandleListRepos(c echo.Context) error {
	login := middleware.GetLogin(c)
	enc, err := h.Store.GetUserToken(c.Request().Context(), login)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "no GitHub token stored; please log in again")
	}
	token, err := decryptToken(enc, h.JWTSecret)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "failed to decrypt GitHub token")
	}
	repos, err := github.ListUserRepos(c.Request().Context(), token)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "failed to list repos")
	}
	return c.JSON(http.StatusOK, repos)
}
