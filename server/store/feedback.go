package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

// FeedbackStatus represents the lifecycle state of a feedback item.
type FeedbackStatus string

const (
	StatusOpen     FeedbackStatus = "open"
	StatusResolved FeedbackStatus = "resolved"
)

// Feedback is a single user-submitted feedback item.
type Feedback struct {
	ID          int64
	URL         string
	Selector    string
	Comment     string
	ContextJSON string
	Screenshot  []byte // may be nil
	GitHubUser  string
	Repo        string
	Label       string
	Status      FeedbackStatus
	IssueURL    string
	CreatedAt   time.Time
}

// URLSummary is a lightweight projection returned for badge rendering.
type URLSummary struct {
	Selector string
	Count    int64
	// IDs of the individual feedback items behind this badge.
	IDs []int64
}

// CreateParams holds the data required to create a feedback item.
type CreateParams struct {
	URL         string
	Selector    string
	Comment     string
	ContextJSON string
	Screenshot  []byte
	GitHubUser  string
	Repo        string
	Label       string
}

// Create inserts a new feedback item and returns it with the generated ID and timestamp.
func (s *Store) Create(ctx context.Context, p CreateParams) (Feedback, error) {
	label := p.Label
	if label == "" {
		label = "feedback"
	}
	const q = `
INSERT INTO feedback (url, selector, comment, context_json, screenshot, github_user, repo, label)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id, created_at`

	var f Feedback
	var createdAt string
	err := s.db.QueryRowContext(ctx, q,
		p.URL, p.Selector, p.Comment, p.ContextJSON, p.Screenshot, p.GitHubUser, p.Repo, label,
	).Scan(&f.ID, &createdAt)
	if err != nil {
		return Feedback{}, fmt.Errorf("store: create feedback: %w", err)
	}
	f.URL = p.URL
	f.Selector = p.Selector
	f.Comment = p.Comment
	f.ContextJSON = p.ContextJSON
	f.Screenshot = p.Screenshot
	f.GitHubUser = p.GitHubUser
	f.Repo = p.Repo
	f.Label = label
	f.Status = StatusOpen
	f.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	return f, nil
}

// Get returns a single feedback item by ID.
func (s *Store) Get(ctx context.Context, id int64) (Feedback, error) {
	const q = `
SELECT id, url, selector, comment, context_json, screenshot, github_user, repo, label, status, COALESCE(issue_url,''), created_at
FROM feedback WHERE id = ?`

	var f Feedback
	var createdAt string
	err := s.db.QueryRowContext(ctx, q, id).Scan(
		&f.ID, &f.URL, &f.Selector, &f.Comment, &f.ContextJSON,
		&f.Screenshot, &f.GitHubUser, &f.Repo, &f.Label, &f.Status, &f.IssueURL, &createdAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return Feedback{}, fmt.Errorf("store: feedback %d not found", id)
	}
	if err != nil {
		return Feedback{}, fmt.Errorf("store: get feedback: %w", err)
	}
	f.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	return f, nil
}

// ListByURL returns all open feedback items for a given page URL, newest first.
func (s *Store) ListByURL(ctx context.Context, url string) ([]Feedback, error) {
	const q = `
SELECT id, url, selector, comment, context_json, screenshot, github_user, repo, label, status, COALESCE(issue_url,''), created_at
FROM feedback WHERE url = ? AND status = 'open'
ORDER BY created_at DESC`

	rows, err := s.db.QueryContext(ctx, q, url)
	if err != nil {
		return nil, fmt.Errorf("store: list by url: %w", err)
	}
	defer rows.Close()

	var items []Feedback
	for rows.Next() {
		var f Feedback
		var createdAt string
		if err := rows.Scan(
			&f.ID, &f.URL, &f.Selector, &f.Comment, &f.ContextJSON,
			&f.Screenshot, &f.GitHubUser, &f.Repo, &f.Label, &f.Status, &f.IssueURL, &createdAt,
		); err != nil {
			return nil, fmt.Errorf("store: scan feedback: %w", err)
		}
		f.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
		items = append(items, f)
	}
	return items, rows.Err()
}

// ListByURLSummary returns per-selector badge counts for a given page URL.
func (s *Store) ListByURLSummary(ctx context.Context, url string) ([]URLSummary, error) {
	const q = `
SELECT selector, COUNT(*) as cnt, GROUP_CONCAT(id) as ids
FROM feedback WHERE url = ? AND status = 'open'
GROUP BY selector
ORDER BY selector`

	rows, err := s.db.QueryContext(ctx, q, url)
	if err != nil {
		return nil, fmt.Errorf("store: summary by url: %w", err)
	}
	defer rows.Close()

	var summaries []URLSummary
	for rows.Next() {
		var s URLSummary
		var idList string
		if err := rows.Scan(&s.Selector, &s.Count, &idList); err != nil {
			return nil, err
		}
		// Parse comma-separated IDs.
		var ids []int64
		for _, part := range splitCSV(idList) {
			var id int64
			if _, err := fmt.Sscanf(part, "%d", &id); err == nil {
				ids = append(ids, id)
			}
		}
		s.IDs = ids
		summaries = append(summaries, s)
	}
	return summaries, rows.Err()
}

// Delete removes a feedback item by ID. Returns an error if the item doesn't
// belong to the given githubUser.
func (s *Store) Delete(ctx context.Context, id int64, githubUser string) error {
	const q = `DELETE FROM feedback WHERE id = ? AND github_user = ?`
	res, err := s.db.ExecContext(ctx, q, id, githubUser)
	if err != nil {
		return fmt.Errorf("store: delete feedback: %w", err)
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return fmt.Errorf("store: feedback %d not found or not owned by %s", id, githubUser)
	}
	return nil
}

// MarkExported sets issue_url and status='resolved' for the given IDs.
func (s *Store) MarkExported(ctx context.Context, ids []int64, issueURL string) error {
	if len(ids) == 0 {
		return nil
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback() //nolint:errcheck
	const q = `UPDATE feedback SET issue_url = ?, status = 'resolved' WHERE id = ?`
	for _, id := range ids {
		if _, err := tx.ExecContext(ctx, q, issueURL, id); err != nil {
			return fmt.Errorf("store: mark exported %d: %w", id, err)
		}
	}
	return tx.Commit()
}

func splitCSV(s string) []string {
	if s == "" {
		return nil
	}
	var out []string
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == ',' {
			out = append(out, s[start:i])
			start = i + 1
		}
	}
	out = append(out, s[start:])
	return out
}
