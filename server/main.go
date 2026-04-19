package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strings"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/handler"
	authmw "github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/emergent-company/feedback-overlay/server/store"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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
	ghClientID := mustEnv("GITHUB_CLIENT_ID")
	ghClientSecret := mustEnv("GITHUB_CLIENT_SECRET")
	ghRedirectURI := mustEnv("GITHUB_REDIRECT_URI")
	allowedOrigins := envOr("ALLOWED_ORIGINS", "*")

	// ── SQLite store ──────────────────────────────────────────────────────────
	s, err := store.Open(dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "fatal: open store: %v\n", err)
		os.Exit(1)
	}
	defer s.Close()

	// ── GitHub OAuth config ───────────────────────────────────────────────────
	ghCfg := &github.Config{
		ClientID:     ghClientID,
		ClientSecret: ghClientSecret,
		RedirectURI:  ghRedirectURI,
	}

	// ── Echo server ───────────────────────────────────────────────────────────
	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS — allow configured origins.
	origins := strings.Split(allowedOrigins, ",")
	for i := range origins {
		origins[i] = strings.TrimSpace(origins[i])
	}
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     origins,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderContentType, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

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

	// Feedback — GET /feedback?url= is public (for badge counts)
	e.GET("/feedback", h.HandleListFeedback)

	// Authenticated routes
	auth := e.Group("", authmw.RequireAuth(jwtSecret))
	auth.GET("/me", h.HandleMe)
	auth.POST("/feedback", h.HandleCreateFeedback)
	auth.GET("/feedback/:id", h.HandleGetFeedback)
	auth.DELETE("/feedback/:id", h.HandleDeleteFeedback)
	auth.POST("/issue/export", h.HandleExportIssue)

	// ── Start ─────────────────────────────────────────────────────────────────
	fmt.Printf("feedback-overlay %s (%s) listening on :%s\n", Version, Commit, port)
	if err := e.Start(":" + port); err != nil && err != http.ErrServerClosed {
		fmt.Fprintf(os.Stderr, "fatal: %v\n", err)
		os.Exit(1)
	}
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
