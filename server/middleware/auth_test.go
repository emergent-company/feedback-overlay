package middleware

import (
	"crypto/rand"
	"crypto/rsa"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestIssueParseRoundtrip(t *testing.T) {
	tok, err := IssueToken("secret", "alice", "https://avatars.example.com/alice.png")
	if err != nil {
		t.Fatalf("IssueToken: %v", err)
	}
	claims, err := ParseToken("secret", tok)
	if err != nil {
		t.Fatalf("ParseToken: %v", err)
	}
	if claims.GitHubLogin != "alice" {
		t.Fatalf("login = %q, want alice", claims.GitHubLogin)
	}
	if claims.AvatarURL != "https://avatars.example.com/alice.png" {
		t.Fatalf("avatar = %q", claims.AvatarURL)
	}
}

func TestParseTokenWrongSecret(t *testing.T) {
	tok, _ := IssueToken("secret", "alice", "")
	if _, err := ParseToken("other-secret", tok); err == nil {
		t.Fatal("expected error for wrong secret")
	}
}

func TestParseTokenRejectsNonHMAC(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatalf("rsa.GenerateKey: %v", err)
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, Claims{
		GitHubLogin: "alice",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})
	s, err := tok.SignedString(key)
	if err != nil {
		t.Fatalf("SignedString: %v", err)
	}
	if _, err := ParseToken("secret", s); err == nil {
		t.Fatal("expected error for non-HMAC token")
	}
}

func TestParseTokenExpired(t *testing.T) {
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		GitHubLogin: "alice",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now().Add(-2 * time.Hour)),
		},
	})
	s, _ := tok.SignedString([]byte("secret"))
	if _, err := ParseToken("secret", s); err == nil {
		t.Fatal("expected error for expired token")
	}
}
