package github

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetIssue(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/repos/org/repo/issues/42" {
			t.Errorf("unexpected path %q", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, `{"state":"closed","number":42,"title":"x"}`)
	}))
	defer srv.Close()

	state, err := getIssue(context.Background(), srv.URL, "tok", "org/repo", 42)
	if err != nil {
		t.Fatalf("getIssue: %v", err)
	}
	if state != "closed" {
		t.Fatalf("state = %q, want closed", state)
	}
}

func TestGetIssueInvalidRepo(t *testing.T) {
	if _, err := getIssue(context.Background(), "http://example.com", "tok", "invalid", 1); err == nil {
		t.Fatal("expected error for invalid repo")
	}
}

func TestGetIssueNon200(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer srv.Close()

	if _, err := getIssue(context.Background(), srv.URL, "tok", "org/repo", 1); err == nil {
		t.Fatal("expected error for non-200")
	}
}
