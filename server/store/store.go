package store

import (
	"context"
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

const schema = `
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS feedback (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  url          TEXT    NOT NULL,
  selector     TEXT    NOT NULL,
  comment      TEXT    NOT NULL,
  context_json TEXT    NOT NULL DEFAULT '{}',
  screenshot   BLOB,
  github_user  TEXT    NOT NULL,
  repo         TEXT    NOT NULL,
  label        TEXT    NOT NULL DEFAULT 'feedback',
  status       TEXT    NOT NULL DEFAULT 'open',
  issue_url    TEXT,
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE INDEX IF NOT EXISTS feedback_url_idx  ON feedback(url);
CREATE INDEX IF NOT EXISTS feedback_repo_idx ON feedback(repo);
`

// Store wraps the SQLite database connection.
type Store struct {
	db *sql.DB
}

// Open opens (or creates) the SQLite database at path and applies the schema.
func Open(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("store: open %s: %w", path, err)
	}
	// SQLite with WAL handles concurrent reads well; allow a small pool.
	db.SetMaxOpenConns(1)

	if _, err := db.ExecContext(context.Background(), schema); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("store: apply schema: %w", err)
	}
	return &Store{db: db}, nil
}

// Close closes the underlying database connection.
func (s *Store) Close() error {
	return s.db.Close()
}

// DB returns the raw *sql.DB for use in sub-packages.
func (s *Store) DB() *sql.DB {
	return s.db
}
