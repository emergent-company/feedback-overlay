package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

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
