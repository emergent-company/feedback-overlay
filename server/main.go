package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/handler"
	authmw "github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/emergent-company/feedback-overlay/server/store"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

//go:embed static/feedback-overlay.js
var staticFiles embed.FS

// Version and Commit are injected at build time via -ldflags.
var (
	Version = "dev"
	Commit  = "unknown"
)

func main() {
	// ── Configuration from environment variables ──────────────────────────────
	port := envOr("PORT", "8080")
	dbPath := envOr("DB_PATH", "/data/feedback-overlay.db")
	jwtSecret := mustEnv("JWT_SECRET")
	ghAppID := mustEnv("GH_APP_ID")
	ghClientID := mustEnv("GH_APP_CLIENT_ID")
	ghClientSecret := mustEnv("GH_APP_CLIENT_SECRET")
	ghRedirectURI := mustEnv("GH_REDIRECT_URI")
	ghInstallID := mustEnv("GH_INSTALLATION_ID")

	// Private key: prefer file path, fall back to inline PEM env var.
	var ghPrivateKey string
	if keyPath := os.Getenv("GH_APP_PRIVATE_KEY_PATH"); keyPath != "" {
		data, err := os.ReadFile(keyPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fatal: read GH_APP_PRIVATE_KEY_PATH: %v\n", err)
			os.Exit(1)
		}
		ghPrivateKey = string(data)
	} else {
		ghPrivateKey = mustEnv("GH_APP_PRIVATE_KEY")
	}
	allowedOrigins := envOr("ALLOWED_ORIGINS", "*")

	// ── SQLite store ──────────────────────────────────────────────────────────
	s, err := store.Open(dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "fatal: open store: %v\n", err)
		os.Exit(1)
	}
	defer s.Close()

	// ── GitHub App config ─────────────────────────────────────────────────────
	ghCfg := &github.AppConfig{
		AppID:          ghAppID,
		ClientID:       ghClientID,
		ClientSecret:   ghClientSecret,
		RedirectURI:    ghRedirectURI,
		PrivateKeyPEM:  ghPrivateKey,
		InstallationID: ghInstallID,
	}

	// ── Echo server ───────────────────────────────────────────────────────────
	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.BodyLimit(envOr("MAX_BODY_BYTES", "10MB")))

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			origin := c.Request().Header.Get("Origin")
			if origin == "" {
				return next(c)
			}
			if !originAllowed(origin, allowedOrigins) {
				return next(c)
			}
			h := c.Response().Header()
			h.Set("Access-Control-Allow-Origin", origin)
			h.Set("Access-Control-Allow-Credentials", "true")
			h.Set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
			h.Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
			h.Set("Vary", "Origin")
			if c.Request().Method == http.MethodOptions {
				return c.NoContent(http.StatusNoContent)
			}
			return next(c)
		}
	})

	// ── Static: serve embedded feedback-overlay.js ────────────────────────────
	staticFS, _ := fs.Sub(staticFiles, "static")
	e.GET("/feedback-overlay.js", echo.WrapHandler(http.FileServer(http.FS(staticFS))))

	// ── Routes ────────────────────────────────────────────────────────────────
	h := handler.New(s, ghCfg, jwtSecret)

	// Auth (public)
	e.GET("/auth/github", h.HandleGitHubLogin)
	e.GET("/auth/callback", h.HandleGitHubCallback)

	// Health (public)
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]any{
			"ok":      true,
			"version": Version,
			"commit":  Commit,
		})
	})

	// Feedback — public read endpoints (counts + public issue refs only, no PII)
	e.GET("/feedback", h.HandleListFeedback)
	e.GET("/issues", h.HandleListIssues)

	// Authenticated routes
	auth := e.Group("", authmw.RequireAuth(jwtSecret))
	auth.GET("/me", h.HandleMe)
	auth.GET("/feedback/list", h.HandleListFeedbackByURL)
	auth.GET("/feedback/:id", h.HandleGetFeedback)
	auth.DELETE("/feedback/:id", h.HandleDeleteFeedback)

	// Write endpoints are rate-limited per client IP to protect the SQLite DB and
	// the upstream GitHub API from abuse. Export is stricter since it calls GitHub.
	feedbackLimiter := middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(
		rate.Limit(envFloatOr("RATE_LIMIT_RPS", 10))))
	exportLimiter := middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(
		rate.Limit(envFloatOr("EXPORT_RATE_LIMIT_RPS", 1))))

	auth.POST("/feedback", h.HandleCreateFeedback, feedbackLimiter)
	auth.POST("/issue/export", h.HandleExportIssue, exportLimiter)

	// ── Start ─────────────────────────────────────────────────────────────────
	fmt.Printf("feedback-overlay %s (%s) listening on :%s\n", Version, Commit, port)
	if err := e.Start(":" + port); err != nil && err != http.ErrServerClosed {
		fmt.Fprintf(os.Stderr, "fatal: %v\n", err)
		os.Exit(1)
	}
}

// originAllowed reports whether the request Origin matches the ALLOWED_ORIGINS
// allowlist. "*" (or an empty list) allows any origin.
func originAllowed(origin, allowlist string) bool {
	for _, allowed := range strings.Split(allowlist, ",") {
		allowed = strings.TrimSpace(allowed)
		if allowed == "*" {
			return true
		}
		if allowed == origin {
			return true
		}
	}
	return false
}

// envFloatOr reads a float environment variable, falling back to def when the
// variable is empty or not parseable as a float.
func envFloatOr(key string, def float64) float64 {
	if v := os.Getenv(key); v != "" {
		if f, err := strconv.ParseFloat(v, 64); err == nil {
			return f
		}
	}
	return def
}

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		fmt.Fprintf(os.Stderr, "fatal: environment variable %s is required\n", key)
		os.Exit(1)
	}
	return v
}
