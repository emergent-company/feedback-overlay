package handler

import (
	"bytes"
	"compress/gzip"
	"context"
	"crypto/subtle"
	"errors"
	"io"
	"net/http"
	"strconv"

	"github.com/emergent-company/feedback-overlay/server/store"
	"github.com/labstack/echo/v4"
)

// retrievalError is a snapshot/screenshot retrieval error carrying an HTTP status.
type retrievalError struct {
	status  int
	message string
}

func (e *retrievalError) Error() string { return e.message }

// authorizedFeedback loads a feedback item and verifies its retrieval secret
// with a constant-time compare. The item's secret gates access to its snapshot,
// screenshot, and context.
func (h *Handler) authorizedFeedback(ctx context.Context, id int64, secret string) (store.Feedback, error) {
	if secret == "" {
		return store.Feedback{}, &retrievalError{http.StatusForbidden, "missing secret"}
	}
	f, err := h.Store.Get(ctx, id)
	if err != nil {
		return store.Feedback{}, &retrievalError{http.StatusNotFound, "not found"}
	}
	if f.SnapshotSecret == "" || subtle.ConstantTimeCompare([]byte(secret), []byte(f.SnapshotSecret)) != 1 {
		return store.Feedback{}, &retrievalError{http.StatusForbidden, "invalid secret"}
	}
	return f, nil
}

// decodeSnapshot decompresses a gzipped snapshot blob.
func decodeSnapshot(b []byte) ([]byte, error) {
	gr, err := gzip.NewReader(bytes.NewReader(b))
	if err != nil {
		return nil, &retrievalError{http.StatusInternalServerError, "failed to decode snapshot"}
	}
	defer func() { _ = gr.Close() }()
	data, err := io.ReadAll(gr)
	if err != nil {
		return nil, &retrievalError{http.StatusInternalServerError, "failed to decode snapshot"}
	}
	return data, nil
}

// retrievalHTTPError converts a retrievalError into an echo HTTP error.
func retrievalHTTPError(err error) error {
	var re *retrievalError
	if errors.As(err, &re) {
		return echo.NewHTTPError(re.status, re.message)
	}
	return echo.NewHTTPError(http.StatusInternalServerError, "failed to load snapshot")
}

// HandleGetSnapshot serves a stored full-page snapshot, gated by a secret.
func (h *Handler) HandleGetSnapshot(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "snapshot not found")
	}
	f, err := h.authorizedFeedback(c.Request().Context(), id, c.QueryParam("secret"))
	if err != nil {
		return retrievalHTTPError(err)
	}
	if len(f.Snapshot) == 0 {
		return echo.NewHTTPError(http.StatusNotFound, "snapshot not found")
	}
	data, err := decodeSnapshot(f.Snapshot)
	if err != nil {
		return retrievalHTTPError(err)
	}
	return c.Blob(http.StatusOK, "text/html; charset=utf-8", data)
}
