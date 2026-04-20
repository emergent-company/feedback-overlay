package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/emergent-company/feedback-overlay/server/github"
	"github.com/emergent-company/feedback-overlay/server/middleware"
	"github.com/emergent-company/feedback-overlay/server/store"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/html"
)

// exportIssueRequest is the JSON body for POST /issue/export.
type exportIssueRequest struct {
	IDs    []int64  `json:"ids"`
	Repo   string   `json:"repo"`
	Labels []string `json:"labels"`
	Title  string   `json:"title"` // optional override; server generates one if empty
}

// HandleExportIssue creates a GitHub issue from one or more feedback items.
func (h *Handler) HandleExportIssue(c echo.Context) error {
	var req exportIssueRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if len(req.IDs) == 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "at least one feedback id is required")
	}
	if req.Repo == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "repo is required")
	}

	ctx := c.Request().Context()

	// Fetch all requested feedback items.
	var items []store.Feedback
	for _, id := range req.IDs {
		f, err := h.Store.Get(ctx, id)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, fmt.Sprintf("feedback %d not found", id))
		}
		items = append(items, f)
	}

	labels := req.Labels
	if len(labels) == 0 && len(items) > 0 {
		labels = []string{items[0].Label}
	}

	title, body := buildIssueContent(items, middleware.GetLogin(c))
	if req.Title != "" {
		title = req.Title
	}

	result, err := github.CreateIssue(ctx, middleware.GetGitHubToken(c), github.CreateIssueParams{
		Repo:   req.Repo,
		Title:  title,
		Body:   body,
		Labels: labels,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "failed to create GitHub issue: "+err.Error())
	}

	// Mark items as exported.
	if err := h.Store.MarkExported(ctx, req.IDs, result.HTMLURL); err != nil {
		// Non-fatal — issue was created, just log the failure.
		c.Logger().Errorf("mark exported: %v", err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"issue_url":    result.HTMLURL,
		"issue_number": result.Number,
	})
}

// buildIssueContent formats the GitHub issue title and Markdown body.
func buildIssueContent(items []store.Feedback, _ string) (title, body string) {
	if len(items) == 0 {
		return "Feedback report", ""
	}

	first := items[0]

	// Title: short description only — no URL.
	if len(items) == 1 {
		title = fmt.Sprintf("Feedback on %s", selectorShort(first.Selector))
	} else {
		title = fmt.Sprintf("Feedback: %d comments on %s", len(items), selectorShort(first.Selector))
	}

	// Parse context from the first item to extract page-level metadata.
	ctx := parseContext(first.ContextJSON)

	var sb strings.Builder
	sb.WriteString("## Feedback\n\n")

	// Page-level metadata (from first item's context).
	pageURL := first.URL
	if u, ok := ctx["url"].(string); ok && u != "" {
		pageURL = u
	}
	sb.WriteString(fmt.Sprintf("**URL:** %s  \n", pageURL))

	if vp, ok := ctx["viewport"].(map[string]any); ok {
		w, _ := vp["width"].(float64)
		h, _ := vp["height"].(float64)
		dpr, _ := ctx["devicePixelRatio"].(float64)
		if w > 0 && h > 0 {
			sb.WriteString(fmt.Sprintf("**Viewport:** %.0f × %.0f px", w, h))
			if dpr > 0 && dpr != 1 {
				sb.WriteString(fmt.Sprintf(" (%.1f× DPR)", dpr))
			}
			sb.WriteString("  \n")
		}
	}

	sb.WriteString("\n---\n\n")

	// One comment block per feedback item.
	for i, f := range items {
		sb.WriteString(fmt.Sprintf("### Comment %d\n\n", i+1))
		sb.WriteString(fmt.Sprintf("**@%s**  \n%s\n\n", f.GitHubUser, f.Comment))
	}

	sb.WriteString("---\n\n")

	// Element info — written once, not per comment.
	sb.WriteString(fmt.Sprintf("**Selector:** `%s`\n\n", first.Selector))

	// Element position & size (visible, not folded).
	if br, ok := ctx["boundingRect"].(map[string]any); ok {
		top, _ := br["top"].(float64)
		left, _ := br["left"].(float64)
		w, _ := br["width"].(float64)
		h, _ := br["height"].(float64)
		sb.WriteString(fmt.Sprintf("**Position:** top %.0f, left %.0f — **Size:** %.0f × %.0f px  \n\n", top, left, w, h))
	}

	// CSS framework detection (visible, not folded).
	if frameworks, ok := ctx["cssFramework"].([]any); ok && len(frameworks) > 0 {
		names := make([]string, 0, len(frameworks))
		for _, f := range frameworks {
			if s, ok := f.(string); ok {
				names = append(names, s)
			}
		}
		if len(names) > 0 {
			sb.WriteString(fmt.Sprintf("**CSS framework:** %s  \n\n", strings.Join(names, ", ")))
		}
	}

	// Key computed styles (visible, not folded).
	if styles, ok := ctx["computedStyles"].(map[string]any); ok && len(styles) > 0 {
		sb.WriteString("<details><summary>Computed styles</summary>\n\n```\n")
		// Stable key order: layout first, then visual.
		order := []string{
			"display", "position", "flexDirection", "flexWrap", "alignItems", "justifyContent",
			"gridTemplateColumns", "gridTemplateRows",
			"width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
			"margin", "padding",
			"color", "backgroundColor", "opacity",
			"fontSize", "fontFamily", "fontWeight", "lineHeight", "textAlign",
			"border", "borderRadius", "boxShadow",
			"overflow", "overflowX", "overflowY",
			"zIndex", "visibility", "cursor",
		}
		for _, k := range order {
			if v, ok := styles[k].(string); ok {
				sb.WriteString(fmt.Sprintf("%-24s %s\n", k+":", v))
			}
		}
		sb.WriteString("```\n\n</details>\n\n")
	}

	// Foldable: element HTML + full context JSON (from first item, shown once).
	outerHTML, _ := ctx["outerHTML"].(string)
	prettyCtx := prettyJSON(first.ContextJSON)

	sb.WriteString("<details><summary>Element HTML &amp; full context</summary>\n\n")
	if outerHTML != "" {
		sb.WriteString("**HTML**\n\n```html\n")
		sb.WriteString(prettyHTML(outerHTML))
		sb.WriteString("\n```\n\n")
	}
	sb.WriteString("**Context**\n\n```json\n")
	sb.WriteString(prettyCtx)
	sb.WriteString("\n```\n\n")
	sb.WriteString("</details>\n")

	return title, sb.String()
}

// selectorShort returns the last segment of a CSS selector for use in titles.
func selectorShort(sel string) string {
	parts := strings.Split(sel, ">")
	last := strings.TrimSpace(parts[len(parts)-1])
	if len(last) > 60 {
		return last[:57] + "…"
	}
	return last
}

// parseContext unmarshals a context JSON string into a map.
func parseContext(raw string) map[string]any {
	if raw == "" || raw == "{}" {
		return nil
	}
	var m map[string]any
	if err := json.Unmarshal([]byte(raw), &m); err != nil {
		return nil
	}
	return m
}

// prettyJSON returns a pretty-printed version of a JSON string.
func prettyJSON(raw string) string {
	if raw == "" {
		return "{}"
	}
	var buf bytes.Buffer
	if err := json.Indent(&buf, []byte(raw), "", "  "); err != nil {
		return raw
	}
	return buf.String()
}

// voidElements are HTML elements that have no closing tag.
var voidElements = map[string]bool{
	"area": true, "base": true, "br": true, "col": true, "embed": true,
	"hr": true, "img": true, "input": true, "link": true, "meta": true,
	"param": true, "source": true, "track": true, "wbr": true,
}

// prettyHTML indents an HTML fragment using the x/net tokenizer.
// Falls back to the raw string on any parse error.
func prettyHTML(raw string) string {
	z := html.NewTokenizer(strings.NewReader(raw))
	var buf strings.Builder
	depth := 0
	const tab = "  "

	writeIndent := func() {
		for i := 0; i < depth; i++ {
			buf.WriteString(tab)
		}
	}

	for {
		tt := z.Next()
		switch tt {
		case html.ErrorToken:
			// EOF or parse error — return what we have (or raw on empty).
			result := strings.TrimRight(buf.String(), "\n")
			if result == "" {
				return raw
			}
			return result

		case html.StartTagToken:
			tok := z.Token()
			writeIndent()
			buf.WriteString(tok.String())
			buf.WriteByte('\n')
			if !voidElements[tok.Data] {
				depth++
			}

		case html.EndTagToken:
			tok := z.Token()
			if !voidElements[tok.Data] {
				depth--
				if depth < 0 {
					depth = 0
				}
			}
			writeIndent()
			buf.WriteString(tok.String())
			buf.WriteByte('\n')

		case html.SelfClosingTagToken:
			tok := z.Token()
			writeIndent()
			buf.WriteString(tok.String())
			buf.WriteByte('\n')

		case html.TextToken:
			text := strings.TrimSpace(string(z.Text()))
			if text == "" {
				continue
			}
			writeIndent()
			buf.WriteString(text)
			buf.WriteByte('\n')

		case html.CommentToken:
			writeIndent()
			buf.WriteString(z.Token().String())
			buf.WriteByte('\n')
		}
	}
}
