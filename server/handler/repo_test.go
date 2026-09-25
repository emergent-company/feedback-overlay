package handler

import "testing"

func TestEncryptDecryptToken(t *testing.T) {
	enc, err := encryptToken("hello", "fake-secret")
	if err != nil {
		t.Fatalf("encryptToken: %v", err)
	}
	got, err := decryptToken(enc, "fake-secret")
	if err != nil {
		t.Fatalf("decryptToken: %v", err)
	}
	if got != "hello" {
		t.Fatalf("decrypted = %q, want %q", got, "hello")
	}
}

func TestDecryptTokenGarbage(t *testing.T) {
	if _, err := decryptToken([]byte("garbage"), "fake-secret"); err == nil {
		t.Fatal("expected error decrypting garbage, got nil")
	}
}

func TestDecryptTokenWrongSecret(t *testing.T) {
	enc, err := encryptToken("hello", "secret-a")
	if err != nil {
		t.Fatalf("encryptToken: %v", err)
	}
	if _, err := decryptToken(enc, "secret-b"); err == nil {
		t.Fatal("expected error with wrong secret, got nil")
	}
}
