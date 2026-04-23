package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

const UserLoginKey = "github_login"

// Claims are the JWT claims stored in the session token.
// The GitHub token is no longer stored here — issue creation uses a
// server-side GitHub App installation token instead.
type Claims struct {
	GitHubLogin string `json:"login"`
	AvatarURL   string `json:"avatar_url"`
	jwt.RegisteredClaims
}

// IssueToken creates a signed JWT for the given GitHub user.
func IssueToken(secret, login, avatarURL string) (string, error) {
	claims := Claims{
		GitHubLogin: login,
		AvatarURL:   avatarURL,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseToken parses and validates a signed JWT.
func ParseToken(secret, tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}
	return claims, nil
}

// RequireAuth is an Echo middleware that validates the Bearer JWT and
// stores the claims in the context.
func RequireAuth(jwtSecret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "missing Authorization header")
			}
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid Authorization header format")
			}
			claims, err := ParseToken(jwtSecret, parts[1])
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid or expired token")
			}
			c.Set(UserLoginKey, claims.GitHubLogin)
			c.Set("avatar_url", claims.AvatarURL)
			return next(c)
		}
	}
}

// GetLogin extracts the GitHub login from an Echo context (set by RequireAuth).
func GetLogin(c echo.Context) string {
	v, _ := c.Get(UserLoginKey).(string)
	return v
}
