package handler

import (
	"strconv"
	"testing"
	"time"
)

func TestOAuthStateRoundtrip(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	if s := h.generateState(""); !validateStateOK(h, s) {
		t.Fatal("valid state should validate")
	}
}

func TestOAuthStateCarriesOrigin(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	origin := "https://app.example.com"
	s := h.generateState(origin)
	got, ok := h.validateState(s)
	if !ok {
		t.Fatal("valid state should validate")
	}
	if got != origin {
		t.Fatalf("origin = %q, want %q", got, origin)
	}
}

func TestOAuthStateRejectsInvalid(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	for _, bad := range []string{"", "garbage", "1234", "1234.", "abc.def", ".abc", "1234.00"} {
		if validateStateOK(h, bad) {
			t.Fatalf("state %q should not validate", bad)
		}
	}
}

func TestOAuthStateRejectsTampered(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	s := h.generateState("")
	b := []byte(s)
	if b[len(b)-1] == '0' {
		b[len(b)-1] = '1'
	} else {
		b[len(b)-1] = '0'
	}
	if validateStateOK(h, string(b)) {
		t.Fatal("tampered state should not validate")
	}
}

func TestOAuthStateExpired(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	payload := strconv.FormatInt(time.Now().Add(-time.Minute).Unix(), 10)
	s := payload + "." + signState(payload, "secret")
	if validateStateOK(h, s) {
		t.Fatal("expired state should not validate")
	}
}

// validateStateOK reports whether s validates, discarding the embedded origin.
func validateStateOK(h *Handler, s string) bool {
	_, ok := h.validateState(s)
	return ok
}
