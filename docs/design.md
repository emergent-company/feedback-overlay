# feedback-overlay — Context Enrichment Design

Status: **v1 + v2 + v3 implemented**.

## Goal

Give the agent that triages a GitHub issue full, correlated context:

1. **Which session** produced the feedback (overlay-minted session ID).
2. **The app's own trace ID**, so the agent can cross-reference the app's logs / Sentry / OTel.
3. **A screenshot** of the element (v1) and later a **full redacted DOM snapshot** (v2).
4. **Programmatic access** for the agent via an **MCP server** (v3).

## Current capture (baseline)

`client/src/index.ts#gatherContext` attaches to every feedback item:

`url`, `viewport`, `devicePixelRatio`, `tagName`, `dataComponent`, `outerHTML`
(truncated 4000), `innerText` (200), `attributes`, `cssFramework`,
`computedStyles`, `boundingRect`, `userAgent`, `timestamp`, `branch`,
`appVersion`, `sessionHistory` (15-event ring buffer).

Stored as `context_json` in SQLite, rendered inline into the GitHub issue body
on export. The `screenshot` column already exists end-to-end (schema, store,
handler) but the client never sends it — dead path.

---

## v1 — Correlation IDs + element screenshot

### Overlay session ID

- Mint a UUID on first load, persist in `sessionStorage` under
  `__fo_session_id__`. Falls back to ephemeral random ID if `sessionStorage`
  or `crypto.randomUUID` is unavailable.
- Attach as `context.sessionId`.
- Purpose: group all feedback items produced by one browser session, so the
  agent can tell "these three comments came from the same visit".

### App trace ID

The overlay cannot guess the app's correlation ID — the app must expose it.
Supported sources, resolved in priority order:

1. `data-session-id` — static ID injected server-side into the script tag.
2. `data-session-id-selector` — CSS selector; read `textContent` of first match.
3. `window.__feedbackSessionId` — a string, or a `() => string` function.

Attach as `context.traceId`. The agent correlates this against the app's own
observability (Sentry `lastEventId`, OTel `traceparent`, backend request ID).
The value is only as real as the app's willingness to expose it; one script
attribute is enough, do not auto-detect telemetry internals.

```html
<script
  src="https://feedback.emergent-company.ai/feedback-overlay.js"
  data-repo="org/repo"
  data-session-id="b8f3…"
  data-session-id-selector="#trace-id"
  async
></script>
```

### Element screenshot

- `html2canvas`, scoped to the clicked element (not full page), best-effort.
- Attach as `screenshot` (base64 PNG data URL) on `POST /feedback`. Server
  already decodes and stores it — no server change.
- On capture failure (cross-origin image taint, `display:contents`, etc.),
  silently omit the screenshot.

Caveat: `html2canvas` approximates rendering; cross-origin images may blank
regions. This is a best-effort aid, not pixel-truth.

---

## v2 — Full DOM snapshot + secret key

Do **not** put full HTML in the issue (noise, PII, bloat). Store server-side,
embed a pointer.

### Capture

On submit, capture `document.documentElement.outerHTML`, run the redaction
pass, gzip, store as a BLOB keyed to the feedback item.

### Redaction rules (mandatory)

Full-page HTML leaks user data. Strip before storing:

- `<input>`, `<textarea>`, `<select>` values.
- `contenteditable` text.
- `<script>` and `<style>` bodies (huge + may contain secrets).
- Attributes matching token/secret signals: `data-key`, `data-token`,
  `data-secret`, `accesskey`, `autocomplete`, and any `data-*` value that
  looks like a credential.
- Query-string params with token-like keys in `src`/`href`.
- `localStorage` values are **never** captured — keys only if ever needed.

Cap gzipped size (~500 KB).

### Secret model

- Secret is minted **at export time** (not feedback creation) — only exported
  items get a secret. 24 random bytes, hex-encoded.
- Stored **plaintext** in `feedback.snapshot_secret`. It is a high-entropy
  capability token in the server's own DB; hashing adds little since the
  snapshot BLOB is co-located. Verified with a constant-time compare.
- Issue body embeds a markdown link plus a machine pointer:
  `feedback://snapshot/<id>?secret=<secret>`.
- Fetch path (v2): `GET /snapshot/:id?secret=<secret>` → gzipped snapshot,
  rate-limited. MCP `get_snapshot` (v3) wraps the same handler.

Security note: in a **public** repo the secret is visible to anyone who can
read the issue. Mitigation: require repo-scoped MCP auth **in addition to**
the key, and/or give secrets a short TTL.

### Backlink

`github_issues` currently stores `issue_number / selector / page_url / repo`
but no feedback IDs, so issue→snapshot lookup is loose (selector + URL match).
Add `github_issues.feedback_ids` (JSON array) for exact resolution.

---

## v3 — MCP server

Add a streamable-HTTP MCP endpoint (`/mcp`) to the existing Echo server —
same binary, same auth surface.

### Tools

```
feedback_get_context(feedback_id, secret)  → full context JSON + screenshot
feedback_get_snapshot(feedback_id, secret) → redacted full DOM snapshot
feedback_list_for_issue(issue_number)      → resolve issue → feedback IDs
```

### Auth

MCP clients present the per-snapshot secret and/or a repo-scoped token
(GitHub App installation token). "Only the agent reading the issue has the
key" = secret embedded in the issue + hashed server-side check.

---

## Schema (future migrations)

| Version | Change |
|---|---|
| v1 | none — new fields ride in `context_json`; `screenshot` column already exists |
| v2 | `feedback` + `snapshot BLOB`, `snapshot_secret TEXT`, `snapshot_size INT`; `github_issues` + `feedback_ids TEXT` |
| v3 | none — MCP reads existing tables |

---

## Security & PII rules (standing)

- Never capture `localStorage` values.
- Redact sensitive input values (already done in `history.ts`; extend to snapshot).
- Secrets are high-entropy capability tokens, verified constant-time; keys embedded in issues get TTL.
- Full snapshots gated by key **and** repo-scoped auth.

## Open questions

- Snapshot storage: SQLite BLOB is fine to start; S3 when volume grows.
- Secret TTL policy for public repos.
- Whether `traceId` should also be sent as a GitHub issue label/tag for
  grouping (likely noise — keep it in context only).
