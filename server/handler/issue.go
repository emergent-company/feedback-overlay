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
)

// exportIssueRequest is the JSON body for POST /issue/export.
type exportIssueRequest struct {
	IDs    []int64 `json:"ids"`
	Repo   string  `json:"repo"`
	Labels []string `json:"labels"`
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

	// Foldable: element HTML + full context JSON (from first item, shown once).
	outerHTML, _ := ctx["outerHTML"].(string)
	prettyCtx := prettyJSON(first.ContextJSON)

	sb.WriteString("<details><summary>Element details</summary>\n\n")
	if outerHTML != "" {
		sb.WriteString("**HTML**\n\n```html\n")
		sb.WriteString(outerHTML)
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
