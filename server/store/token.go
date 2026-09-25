package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

// ErrTokenNotFound is returned when a user has no stored token.
var ErrTokenNotFound = errors.New("user token not found")

// UpsertUserToken stores an encrypted GitHub access token for a user.
func (s *Store) UpsertUserToken(ctx context.Context, githubUser string, encrypted []byte) error {
	const q = `
INSERT INTO user_tokens (github_user, token_encrypted, updated_at)
VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%SZ','now'))
ON CONFLICT(github_user) DO UPDATE SET
  token_encrypted = excluded.token_encrypted,
  updated_at      = excluded.updated_at`
	if _, err := s.db.ExecContext(ctx, q, githubUser, encrypted); err != nil {
		return fmt.Errorf("store: upsert user token: %w", err)
	}
	return nil
}

// GetUserToken returns the encrypted GitHub access token for a user.
func (s *Store) GetUserToken(ctx context.Context, githubUser string) ([]byte, error) {
	const q = `SELECT token_encrypted FROM user_tokens WHERE github_user = ?`
	var b []byte
	err := s.db.QueryRowContext(ctx, q, githubUser).Scan(&b)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrTokenNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("store: get user token: %w", err)
	}
	return b, nil
}
