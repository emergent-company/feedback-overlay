package handler

import (
	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/store"
)

// Handler holds the shared dependencies for all HTTP handlers.
type Handler struct {
	Store     *store.Store
	GHConfig  *github.Config
	JWTSecret string
}

// New creates a new Handler with the given dependencies.
func New(s *store.Store, ghCfg *github.Config, jwtSecret string) *Handler {
	return &Handler{
		Store:     s,
		GHConfig:  ghCfg,
		JWTSecret: jwtSecret,
	}
}
