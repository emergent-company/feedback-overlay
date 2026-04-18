package handler

import (
	"encoding/base64"
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
func buildIssueContent(items []store.Feedback, reporter string) (title, body string) {
	if len(items) == 0 {
		return "Feedback report", ""
	}

	// Use the page URL from the first item for the title.
	pageURL := items[0].URL
	title = fmt.Sprintf("Feedback: %s", pageURL)

	var sb strings.Builder
	sb.WriteString("## Feedback Report\n\n")
	sb.WriteString(fmt.Sprintf("**Page:** %s  \n", pageURL))
	sb.WriteString(fmt.Sprintf("**Repo:** `%s`  \n", items[0].Repo))
	sb.WriteString(fmt.Sprintf("**Reporter:** @%s  \n\n", reporter))
	sb.WriteString("---\n\n")

	for i, f := range items {
		sb.WriteString(fmt.Sprintf("### Item %d\n\n", i+1))
		sb.WriteString(fmt.Sprintf("**Comment**  \n%s\n\n", f.Comment))
		sb.WriteString(fmt.Sprintf("**Element**  \n- Selector: `%s`\n\n", f.Selector))

		if f.ContextJSON != "" && f.ContextJSON != "{}" {
			sb.WriteString("<details><summary>Context</summary>\n\n```json\n")
			sb.WriteString(f.ContextJSON)
			sb.WriteString("\n```\n</details>\n\n")
		}

		if len(f.Screenshot) > 0 {
			b64 := base64.StdEncoding.EncodeToString(f.Screenshot)
			sb.WriteString(fmt.Sprintf("**Screenshot**  \n![screenshot](data:image/png;base64,%s)\n\n", b64))
		}

		sb.WriteString(fmt.Sprintf("*Submitted: %s*\n\n", f.CreatedAt.Format("2006-01-02 15:04 UTC")))
		if i < len(items)-1 {
			sb.WriteString("---\n\n")
		}
	}

	return title, sb.String()
}
