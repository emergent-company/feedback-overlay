# Dockerfile — feedback-overlay
#
# Three-stage build:
#   1. node-builder  — compiles the TypeScript client → feedback-overlay.js
#   2. go-builder    — compiles the Go server (embeds the JS bundle)
#   3. runtime       — minimal alpine image
#
# Usage:
#   docker build \
#     --build-arg VERSION=$(cat VERSION) \
#     --build-arg COMMIT=$(git rev-parse --short HEAD) \
#     -t ghcr.io/emergent-company/feedback-overlay:<version> .
#
# Required runtime env vars:
#   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI, JWT_SECRET
# Optional:
#   PORT (default 8080), DB_PATH (default /data/feedback-overlay.db),
#   ALLOWED_ORIGINS (comma-separated, default *)

# ── Stage 1: build JS client ───────────────────────────────────────────────────
FROM node:22-alpine AS node-builder

WORKDIR /client
COPY client/package*.json ./
RUN npm ci --prefer-offline
COPY client/ ./
RUN npm run build

# ── Stage 2: build Go server ───────────────────────────────────────────────────
FROM golang:1.24.2-alpine AS go-builder

RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /src

ENV GONOSUMDB=github.com/emergent-company/*
# Allow the 1.24 toolchain to satisfy modules that declare a higher go version.
ENV GOTOOLCHAIN=auto

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Overwrite the placeholder with the real built JS bundle.
COPY --from=node-builder /client/../server/static/feedback-overlay.js ./server/static/feedback-overlay.js

ARG VERSION=dev
ARG COMMIT=unknown

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
      -ldflags="-s -w \
        -X main.Version=${VERSION} \
        -X main.Commit=${COMMIT}" \
      -o /out/feedback-overlay-server \
      ./server

# ── Stage 3: runtime ───────────────────────────────────────────────────────────
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata wget

# Non-root user
RUN addgroup -S feedback && adduser -S feedback -G feedback

COPY --from=go-builder /out/feedback-overlay-server /usr/local/bin/feedback-overlay-server

# Persistent data volume for SQLite database
VOLUME ["/data"]

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=30s \
  CMD wget -qO- http://localhost:8080/health || exit 1

USER feedback

ENTRYPOINT ["/usr/local/bin/feedback-overlay-server"]
