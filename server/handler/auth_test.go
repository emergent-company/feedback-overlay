package handler

import (
	"strconv"
	"testing"
	"time"
)

func TestOAuthStateRoundtrip(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	if s := h.generateState(); !h.validateState(s) {
		t.Fatal("valid state should validate")
	}
}

func TestOAuthStateRejectsInvalid(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	for _, bad := range []string{"", "garbage", "1234", "1234.", "abc.def", ".abc", "1234.00"} {
		if h.validateState(bad) {
			t.Fatalf("state %q should not validate", bad)
		}
	}
}

func TestOAuthStateRejectsTampered(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	s := h.generateState()
	b := []byte(s)
	if b[len(b)-1] == '0' {
		b[len(b)-1] = '1'
	} else {
		b[len(b)-1] = '0'
	}
	if h.validateState(string(b)) {
		t.Fatal("tampered state should not validate")
	}
}

func TestOAuthStateExpired(t *testing.T) {
	h := &Handler{JWTSecret: "secret"}
	payload := strconv.FormatInt(time.Now().Add(-time.Minute).Unix(), 10)
	s := payload + "." + signState(payload, "secret")
	if h.validateState(s) {
		t.Fatal("expired state should not validate")
	}
}
