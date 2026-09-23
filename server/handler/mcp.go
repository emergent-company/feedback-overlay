package handler

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// MCPServer builds the MCP server with all feedback tools registered.
func (h *Handler) MCPServer() *mcp.Server {
	srv := mcp.NewServer(&mcp.Implementation{Name: "feedback-overlay", Version: "1.0.0"}, nil)

	mcp.AddTool(srv, &mcp.Tool{
		Name:        "feedback_get_snapshot",
		Description: "Return the redacted full-page DOM snapshot for a feedback item, gated by its retrieval secret.",
	}, h.toolGetSnapshot)

	mcp.AddTool(srv, &mcp.Tool{
		Name:        "feedback_get_screenshot",
		Description: "Return the element screenshot (base64 PNG) for a feedback item, gated by its retrieval secret.",
	}, h.toolGetScreenshot)

	mcp.AddTool(srv, &mcp.Tool{
		Name:        "feedback_get_context",
		Description: "Return the captured context JSON for a feedback item, gated by its retrieval secret.",
	}, h.toolGetContext)

	mcp.AddTool(srv, &mcp.Tool{
		Name:        "feedback_list_for_issue",
		Description: "Resolve a GitHub issue number to the feedback items it was exported from.",
	}, h.toolListForIssue)

	return srv
}

// retrievalInput is the shared input for secret-gated tools.
type retrievalInput struct {
	FeedbackID int64  `json:"feedback_id" jsonschema:"the feedback row id"`
	Secret     string `json:"secret" jsonschema:"the retrieval secret from the issue body"`
}

type snapshotOutput struct {
	HTML string `json:"html"`
}

func (h *Handler) toolGetSnapshot(ctx context.Context, _ *mcp.CallToolRequest, in retrievalInput) (*mcp.CallToolResult, snapshotOutput, error) {
	f, err := h.authorizedFeedback(ctx, in.FeedbackID, in.Secret)
	if err != nil {
		return nil, snapshotOutput{}, err
	}
	if len(f.Snapshot) == 0 {
		return nil, snapshotOutput{}, fmt.Errorf("no snapshot for feedback %d", in.FeedbackID)
	}
	data, err := decodeSnapshot(f.Snapshot)
	if err != nil {
		return nil, snapshotOutput{}, err
	}
	return nil, snapshotOutput{HTML: string(data)}, nil
}

type screenshotOutput struct {
	Image     string `json:"image_base64"`
	MediaType string `json:"media_type"`
}

func (h *Handler) toolGetScreenshot(ctx context.Context, _ *mcp.CallToolRequest, in retrievalInput) (*mcp.CallToolResult, screenshotOutput, error) {
	f, err := h.authorizedFeedback(ctx, in.FeedbackID, in.Secret)
	if err != nil {
		return nil, screenshotOutput{}, err
	}
	if len(f.Screenshot) == 0 {
		return nil, screenshotOutput{}, fmt.Errorf("no screenshot for feedback %d", in.FeedbackID)
	}
	return nil, screenshotOutput{
		Image:     base64.StdEncoding.EncodeToString(f.Screenshot),
		MediaType: "image/png",
	}, nil
}

type contextOutput struct {
	Context map[string]any `json:"context"`
}

func (h *Handler) toolGetContext(ctx context.Context, _ *mcp.CallToolRequest, in retrievalInput) (*mcp.CallToolResult, contextOutput, error) {
	f, err := h.authorizedFeedback(ctx, in.FeedbackID, in.Secret)
	if err != nil {
		return nil, contextOutput{}, err
	}
	var m map[string]any
	if f.ContextJSON != "" && f.ContextJSON != "{}" {
		if err := json.Unmarshal([]byte(f.ContextJSON), &m); err != nil {
			return nil, contextOutput{}, fmt.Errorf("corrupt context for feedback %d", in.FeedbackID)
		}
	}
	return nil, contextOutput{Context: m}, nil
}

type issueInput struct {
	IssueNumber int64 `json:"issue_number" jsonschema:"the GitHub issue number"`
}

type feedbackRef struct {
	ID            int64  `json:"id"`
	Selector      string `json:"selector"`
	URL           string `json:"url"`
	Comment       string `json:"comment"`
	HasScreenshot bool   `json:"has_screenshot"`
	HasSnapshot   bool   `json:"has_snapshot"`
}

type listForIssueOutput struct {
	IssueNumber int64         `json:"issue_number"`
	Feedback    []feedbackRef `json:"feedback"`
}

func (h *Handler) toolListForIssue(ctx context.Context, _ *mcp.CallToolRequest, in issueInput) (*mcp.CallToolResult, listForIssueOutput, error) {
	gi, err := h.Store.GetGitHubIssueByNumber(ctx, in.IssueNumber)
	if err != nil {
		return nil, listForIssueOutput{}, err
	}
	var ids []int64
	if gi.FeedbackIDs != "" {
		_ = json.Unmarshal([]byte(gi.FeedbackIDs), &ids)
	}
	out := listForIssueOutput{IssueNumber: in.IssueNumber}
	for _, id := range ids {
		f, err := h.Store.Get(ctx, id)
		if err != nil {
			continue
		}
		out.Feedback = append(out.Feedback, feedbackRef{
			ID:            f.ID,
			Selector:      f.Selector,
			URL:           f.URL,
			Comment:       f.Comment,
			HasScreenshot: len(f.Screenshot) > 0,
			HasSnapshot:   len(f.Snapshot) > 0,
		})
	}
	return nil, out, nil
}
