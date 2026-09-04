package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

func TestOriginAllowed(t *testing.T) {
	cases := []struct {
		name      string
		origin    string
		allowlist string
		want      bool
	}{
		{"wildcard allows any", "https://a.example.com", "*", true},
		{"empty allowlist denies", "https://a.example.com", "", false},
		{"exact match", "https://a.example.com", "https://a.example.com,https://b.example.com", true},
		{"later entry matches", "https://b.example.com", "https://a.example.com,https://b.example.com", true},
		{"not in list", "https://evil.example.com", "https://a.example.com,https://b.example.com", false},
		{"whitespace trimmed", "https://b.example.com", "  https://a.example.com , https://b.example.com  ", true},
		{"substring is not match", "https://a.example.com.evil.com", "https://a.example.com", false},
		{"trailing slash matters", "https://a.example.com/", "https://a.example.com", false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := originAllowed(c.origin, c.allowlist); got != c.want {
				t.Fatalf("originAllowed(%q, %q) = %v, want %v", c.origin, c.allowlist, got, c.want)
			}
		})
	}
}

func TestEnvFloatOr(t *testing.T) {
	t.Run("default when unset", func(t *testing.T) {
		t.Setenv("TEST_ENV_FLOAT", "")
		if got := envFloatOr("TEST_ENV_FLOAT", 10); got != 10 {
			t.Fatalf("got %v, want 10", got)
		}
	})
	t.Run("parses valid", func(t *testing.T) {
		t.Setenv("TEST_ENV_FLOAT", "2.5")
		if got := envFloatOr("TEST_ENV_FLOAT", 10); got != 2.5 {
			t.Fatalf("got %v, want 2.5", got)
		}
	})
	t.Run("falls back on invalid", func(t *testing.T) {
		t.Setenv("TEST_ENV_FLOAT", "abc")
		if got := envFloatOr("TEST_ENV_FLOAT", 10); got != 10 {
			t.Fatalf("got %v, want 10", got)
		}
	})
}

func TestRateLimitBlocksExcess(t *testing.T) {
	e := echo.New()
	e.GET("/limited", func(c echo.Context) error {
		return c.NoContent(http.StatusOK)
	}, middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(1))))

	var allowed, limited int
	for i := 0; i < 5; i++ {
		req := httptest.NewRequest(http.MethodGet, "/limited", nil)
		req.RemoteAddr = "203.0.113.7:1234"
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		switch rec.Code {
		case http.StatusOK:
			allowed++
		case http.StatusTooManyRequests:
			limited++
		}
	}
	if allowed < 1 {
		t.Fatalf("expected at least one allowed request, got %d", allowed)
	}
	if limited < 1 {
		t.Fatalf("expected at least one 429 response, got %d", limited)
	}
}
