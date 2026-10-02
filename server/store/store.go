package store

import (
	"context"
	"database/sql"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"github.com/emergent-company/emergent.feedback/server/ext"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "modernc.org/sqlite"
)

const pragmas = `PRAGMA journal_mode=WAL;`

type dialect int

const (
	dialectSQLite dialect = iota
	dialectPostgres
)

func (d dialect) driverName() string {
	if d == dialectPostgres {
		return "pgx"
	}
	return "sqlite"
}

// rebind rewrites SQLite '?' placeholders to Postgres '$1..$n'. Identity for
// SQLite. Safe across single-quoted string literals and doubled-quote escapes.
func (d dialect) rebind(query string) string {
	if d != dialectPostgres || !strings.Contains(query, "?") {
		return query
	}
	var b strings.Builder
	b.Grow(len(query) + 8)
	n := 0
	for i := 0; i < len(query); i++ {
		switch c := query[i]; c {
		case '?':
			n++
			b.WriteByte('$')
			b.WriteString(strconv.Itoa(n))
		case '\'':
			b.WriteByte(c)
			i++
			for i < len(query) {
				b.WriteByte(query[i])
				if query[i] == '\'' {
					if i+1 < len(query) && query[i+1] == '\'' {
						b.WriteByte(query[i+1])
						i++
					} else {
						break
					}
				}
				i++
			}
		default:
			b.WriteByte(c)
		}
	}
	return b.String()
}

// nowExpr is the inline "current UTC time as RFC3339 TEXT" expression.
func (d dialect) nowExpr() string {
	if d == dialectPostgres {
		return `to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"')`
	}
	return `strftime('%Y-%m-%dT%H:%M:%SZ','now')`
}

func (d dialect) groupConcat(col string) string {
	if d == dialectPostgres {
		return "STRING_AGG(" + col + "::text, ',')"
	}
	return "GROUP_CONCAT(" + col + ")"
}

func (d dialect) maxOpenConns() int {
	if d == dialectPostgres {
		return 20
	}
	return 4
}

func (d dialect) migrations() []migration {
	if d == dialectPostgres {
		return postgresMigrations
	}
	return sqliteMigrations
}

func (d dialect) schemaMigrationsDDL() string {
	if d == dialectPostgres {
		return `CREATE TABLE IF NOT EXISTS schema_migrations (
  version    BIGINT PRIMARY KEY,
  name       TEXT   NOT NULL,
  applied_at TEXT   NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
);`
	}
	return `CREATE TABLE IF NOT EXISTS schema_migrations (
  version    INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  applied_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);`
}

func (s *Store) bind(q string) string { return s.d.rebind(q) }

// migration is a single versioned, ordered schema step. Append new migrations
// to the list — never edit an already-released one.
type migration struct {
	version int
	name    string
	stmts   []string
}

// sqliteMigrations are applied in ascending version order, each inside its own
// transaction. version 1 is the initial schema (idempotent).
var sqliteMigrations = []migration{
	{1, "init", []string{
		`CREATE TABLE IF NOT EXISTS feedback (
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
);`,
		`CREATE TABLE IF NOT EXISTS github_issues (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_number INTEGER NOT NULL,
  issue_url    TEXT    NOT NULL,
  repo         TEXT    NOT NULL,
  title        TEXT    NOT NULL,
  page_url     TEXT    NOT NULL,
  selector     TEXT    NOT NULL,
  state        TEXT    NOT NULL DEFAULT 'open',
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  synced_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);`,
		`CREATE INDEX IF NOT EXISTS feedback_url_idx       ON feedback(url);`,
		`CREATE INDEX IF NOT EXISTS feedback_repo_idx      ON feedback(repo);`,
		`CREATE INDEX IF NOT EXISTS github_issues_url_idx  ON github_issues(page_url);`,
		`CREATE INDEX IF NOT EXISTS github_issues_repo_idx ON github_issues(repo);`,
	}},
	{2, "snapshot", []string{
		`ALTER TABLE feedback ADD COLUMN snapshot BLOB;`,
		`ALTER TABLE feedback ADD COLUMN snapshot_secret TEXT;`,
		`ALTER TABLE feedback ADD COLUMN snapshot_size INTEGER;`,
		`ALTER TABLE github_issues ADD COLUMN feedback_ids TEXT;`,
	}},
	{3, "api_keys", []string{
		`CREATE TABLE IF NOT EXISTS api_keys (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  github_user TEXT NOT NULL,
  key_hash    TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  revoked_at  TEXT
);`,
		`CREATE TABLE IF NOT EXISTS api_key_repos (
  api_key_id  INTEGER NOT NULL,
  repo        TEXT NOT NULL,
  PRIMARY KEY (api_key_id, repo)
);`,
		`CREATE INDEX IF NOT EXISTS api_keys_user_idx ON api_keys(github_user);`,
	}},
	{4, "user_tokens", []string{
		`CREATE TABLE IF NOT EXISTS user_tokens (
  github_user     TEXT PRIMARY KEY,
  token_encrypted BLOB NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);`,
	}},
}

// postgresMigrations mirror sqliteMigrations with PostgreSQL DDL. Same version
// numbers and names so the ledger matches across dialects.
var postgresMigrations = []migration{
	{1, "init", []string{
		`CREATE TABLE IF NOT EXISTS feedback (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url          TEXT    NOT NULL,
  selector     TEXT    NOT NULL,
  comment      TEXT    NOT NULL,
  context_json TEXT    NOT NULL DEFAULT '{}',
  screenshot   BYTEA,
  github_user  TEXT    NOT NULL,
  repo         TEXT    NOT NULL,
  label        TEXT    NOT NULL DEFAULT 'feedback',
  status       TEXT    NOT NULL DEFAULT 'open',
  issue_url    TEXT,
  created_at   TEXT    NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
);`,
		`CREATE TABLE IF NOT EXISTS github_issues (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  issue_number BIGINT  NOT NULL,
  issue_url    TEXT    NOT NULL,
  repo         TEXT    NOT NULL,
  title        TEXT    NOT NULL,
  page_url     TEXT    NOT NULL,
  selector     TEXT    NOT NULL,
  state        TEXT    NOT NULL DEFAULT 'open',
  created_at   TEXT    NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  synced_at    TEXT    NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
);`,
		`CREATE INDEX IF NOT EXISTS feedback_url_idx       ON feedback(url);`,
		`CREATE INDEX IF NOT EXISTS feedback_repo_idx      ON feedback(repo);`,
		`CREATE INDEX IF NOT EXISTS github_issues_url_idx  ON github_issues(page_url);`,
		`CREATE INDEX IF NOT EXISTS github_issues_repo_idx ON github_issues(repo);`,
	}},
	{2, "snapshot", []string{
		`ALTER TABLE feedback ADD COLUMN snapshot BYTEA;`,
		`ALTER TABLE feedback ADD COLUMN snapshot_secret TEXT;`,
		`ALTER TABLE feedback ADD COLUMN snapshot_size BIGINT;`,
		`ALTER TABLE github_issues ADD COLUMN feedback_ids TEXT;`,
	}},
	{3, "api_keys", []string{
		`CREATE TABLE IF NOT EXISTS api_keys (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  github_user TEXT NOT NULL,
  key_hash    TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  revoked_at  TEXT
);`,
		`CREATE TABLE IF NOT EXISTS api_key_repos (
  api_key_id  BIGINT NOT NULL,
  repo        TEXT NOT NULL,
  PRIMARY KEY (api_key_id, repo)
);`,
		`CREATE INDEX IF NOT EXISTS api_keys_user_idx ON api_keys(github_user);`,
	}},
	{4, "user_tokens", []string{
		`CREATE TABLE IF NOT EXISTS user_tokens (
  github_user     TEXT PRIMARY KEY,
  token_encrypted BYTEA NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  updated_at      TEXT NOT NULL DEFAULT (to_char(now() AT TIME ZONE 'utc','YYYY-MM-DD"T"HH24:MI:SS"Z"'))
);`,
	}},
}

// Store wraps the database connection.
type Store struct {
	db *sql.DB
	d  dialect
}

// dsnWithPragmas appends per-connection PRAGMAs to the SQLite DSN. Every
// connection in the pool gets foreign-key enforcement and a busy timeout, so
// concurrent access waits rather than failing with SQLITE_BUSY.
func dsnWithPragmas(path string) string {
	sep := "?"
	if strings.Contains(path, "?") {
		sep = "&"
	}
	return path + sep + "_pragma=foreign_keys(1)&_pragma=busy_timeout(10000)"
}

// OpenSQLite opens (or creates) the SQLite database at path and applies the schema.
func OpenSQLite(path string) (*Store, error) {
	d := dialectSQLite
	db, err := sql.Open(d.driverName(), dsnWithPragmas(path))
	if err != nil {
		return nil, fmt.Errorf("store: open %s: %w", path, err)
	}
	db.SetMaxOpenConns(d.maxOpenConns())
	ctx := context.Background()
	if _, err := db.ExecContext(ctx, pragmas); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("store: apply pragmas: %w", err)
	}
	if err := migrate(ctx, db, d); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &Store{db: db, d: d}, nil
}

// OpenPostgres opens a Postgres database via the pgx stdlib driver and applies the schema.
func OpenPostgres(dsn string) (*Store, error) {
	d := dialectPostgres
	db, err := sql.Open(d.driverName(), dsn)
	if err != nil {
		return nil, fmt.Errorf("store: open postgres: %w", err)
	}
	db.SetMaxOpenConns(d.maxOpenConns())
	ctx := context.Background()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("store: ping postgres: %w", err)
	}
	if err := migrate(ctx, db, d); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &Store{db: db, d: d}, nil
}

// Close closes the underlying database connection.
func (s *Store) Close() error {
	return s.db.Close()
}

// DB returns the raw *sql.DB for use in sub-packages.
func (s *Store) DB() *sql.DB {
	return s.db
}

// Dialect reports the underlying database engine.
func (s *Store) Dialect() ext.Dialect {
	if s.d == dialectPostgres {
		return ext.DialectPostgres
	}
	return ext.DialectSQLite
}

// Migrate applies extension-owned migrations (versions must exceed the current
// schema version) inside the shared schema_migrations ledger.
func (s *Store) Migrate(ctx context.Context, extra []ext.Migration) error {
	mig := append([]ext.Migration(nil), extra...)
	sort.Slice(mig, func(i, j int) bool { return mig[i].Version < mig[j].Version })

	var current int
	if err := s.db.QueryRowContext(ctx, s.bind(`SELECT COALESCE(MAX(version),0) FROM schema_migrations`)).Scan(&current); err != nil {
		return fmt.Errorf("store: read schema version: %w", err)
	}
	for _, m := range mig {
		if m.Version <= current {
			return fmt.Errorf("store: extension migration %d (%s) must be greater than current schema version %d", m.Version, m.Name, current)
		}
		if err := applyMigration(ctx, s.db, s.d, migration{version: m.Version, name: m.Name, stmts: m.Statements}); err != nil {
			return err
		}
		current = m.Version
	}
	return nil
}

// migrate applies any pending schema migrations in order.
func migrate(ctx context.Context, db *sql.DB, d dialect) error {
	if _, err := db.ExecContext(ctx, d.schemaMigrationsDDL()); err != nil {
		return fmt.Errorf("store: create schema_migrations: %w", err)
	}

	var current int
	if err := db.QueryRowContext(ctx, `SELECT COALESCE(MAX(version), 0) FROM schema_migrations`).Scan(&current); err != nil {
		return fmt.Errorf("store: read schema version: %w", err)
	}

	for _, m := range d.migrations() {
		if m.version <= current {
			continue
		}
		if err := applyMigration(ctx, db, d, m); err != nil {
			return err
		}
	}
	return nil
}

func applyMigration(ctx context.Context, db *sql.DB, d dialect, m migration) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("store: begin migration %d: %w", m.version, err)
	}
	defer tx.Rollback() //nolint:errcheck

	for _, stmt := range m.stmts {
		if _, err := tx.ExecContext(ctx, d.rebind(stmt)); err != nil {
			return fmt.Errorf("store: migrate %d (%s): %w", m.version, m.name, err)
		}
	}
	if _, err := tx.ExecContext(ctx, d.rebind(`INSERT INTO schema_migrations (version, name) VALUES (?, ?)`), m.version, m.name); err != nil {
		return fmt.Errorf("store: record migration %d (%s): %w", m.version, m.name, err)
	}
	return tx.Commit()
}
