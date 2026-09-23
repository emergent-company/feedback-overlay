package handler

import (
	"bytes"
	"compress/gzip"
	"io"
)

// decodeSnapshot decompresses a gzipped snapshot blob.
func decodeSnapshot(b []byte) ([]byte, error) {
	gr, err := gzip.NewReader(bytes.NewReader(b))
	if err != nil {
		return nil, err
	}
	defer func() { _ = gr.Close() }()
	return io.ReadAll(gr)
}
