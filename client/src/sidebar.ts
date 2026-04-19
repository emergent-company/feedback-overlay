// sidebar.ts — fixed right-hand panel showing all page comments.

import type { FeedbackComment } from "./api";

const SIDEBAR_ID = "__fo_sidebar__";
const STYLE_ID = "__fo_sidebar_styles__";

export interface SidebarOptions {
  comments: FeedbackComment[];
  onExportAll: (ids: number[]) => Promise<void>;
  onClose: () => void;
}

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #__fo_sidebar__ {
      position: fixed;
      top: 0;
      right: 0;
      width: 340px;
      height: 100vh;
      z-index: 2147483646;
      background: #fff;
      box-shadow: -4px 0 24px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      color: #111;
      transform: translateX(100%);
      transition: transform 0.2s ease;
    }
    #__fo_sidebar__.fo-open {
      transform: translateX(0);
    }
    #__fo_sidebar__ * { box-sizing: border-box; }

    #__fo_sidebar__ .fo-sb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid #e8e8e8;
      flex-shrink: 0;
    }
    #__fo_sidebar__ .fo-sb-header h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_sidebar__ .fo-sb-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #666;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 4px;
    }
    #__fo_sidebar__ .fo-sb-close:hover { background: #f0f0f0; color: #111; }

    #__fo_sidebar__ .fo-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }
    #__fo_sidebar__ .fo-sb-empty {
      padding: 32px 16px;
      text-align: center;
      color: #888;
      font-size: 13px;
    }
    #__fo_sidebar__ .fo-sb-group {
      border-bottom: 1px solid #f0f0f0;
    }
    #__fo_sidebar__ .fo-sb-group-header {
      padding: 10px 16px 6px;
      background: #fafafa;
      font-size: 10px;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      color: #555;
      word-break: break-all;
      line-height: 1.4;
      border-bottom: 1px solid #f0f0f0;
    }
    #__fo_sidebar__ .fo-sb-comment {
      padding: 10px 16px;
      border-bottom: 1px solid #f5f5f5;
    }
    #__fo_sidebar__ .fo-sb-comment:last-child { border-bottom: none; }
    #__fo_sidebar__ .fo-sb-comment-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    #__fo_sidebar__ .fo-sb-author {
      font-weight: 600;
      font-size: 12px;
      color: #0f0f0f;
    }
    #__fo_sidebar__ .fo-sb-date {
      font-size: 11px;
      color: #999;
    }
    #__fo_sidebar__ .fo-sb-comment-text {
      color: #222;
      line-height: 1.5;
    }

    #__fo_sidebar__ .fo-sb-footer {
      flex-shrink: 0;
      padding: 12px 16px;
      border-top: 1px solid #e8e8e8;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #__fo_sidebar__ .fo-sb-hint {
      font-size: 11px;
      color: #888;
      text-align: center;
    }
    #__fo_sidebar__ .fo-sb-export {
      width: 100%;
      padding: 9px;
      background: #4f86f7;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    #__fo_sidebar__ .fo-sb-export:hover { background: #3a6fd8; }
    #__fo_sidebar__ .fo-sb-export:disabled { background: #a0baf7; cursor: default; }
    #__fo_sidebar__ .fo-sb-error {
      font-size: 12px;
      color: #c53030;
      text-align: center;
    }
  `;
  document.head.appendChild(style);
}

export function isSidebarOpen(): boolean {
  const el = document.getElementById(SIDEBAR_ID);
  return !!el && el.classList.contains("fo-open");
}

export function showSidebar(opts: SidebarOptions): void {
  injectStyles();

  let sidebar = document.getElementById(SIDEBAR_ID);
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = SIDEBAR_ID;
    document.body.appendChild(sidebar);
  }

  // Group comments by selector, preserving insertion order.
  const groups = new Map<string, FeedbackComment[]>();
  for (const c of opts.comments) {
    if (!groups.has(c.selector)) groups.set(c.selector, []);
    groups.get(c.selector)!.push(c);
  }

  const allIds = opts.comments.map((c) => c.id);
  const count = opts.comments.length;

  let bodyHTML = "";
  if (count === 0) {
    bodyHTML = `<div class="fo-sb-empty">No comments on this page yet.<br>Hold <strong>Alt+Shift</strong> and click any element to add one.</div>`;
  } else {
    for (const [selector, items] of groups) {
      bodyHTML += `<div class="fo-sb-group">
        <div class="fo-sb-group-header">${escapeHtml(selector)}</div>
        ${items.map((item) => `
          <div class="fo-sb-comment">
            <div class="fo-sb-comment-meta">
              <span class="fo-sb-author">@${escapeHtml(item.github_user)}</span>
              <span class="fo-sb-date">${escapeHtml(item.created_at)}</span>
            </div>
            <div class="fo-sb-comment-text">${escapeHtml(item.comment)}</div>
          </div>`).join("")}
      </div>`;
    }
  }

  sidebar.innerHTML = `
    <div class="fo-sb-header">
      <h2>${count} comment${count !== 1 ? "s" : ""} on this page</h2>
      <button class="fo-sb-close" id="__fo_sb_close__" title="Close">✕</button>
    </div>
    <div class="fo-sb-body">${bodyHTML}</div>
    <div class="fo-sb-footer">
      <div class="fo-sb-hint">Hold <strong>Alt+Shift</strong> and click any element to add a comment</div>
      <button class="fo-sb-export" id="__fo_sb_export__" ${count === 0 ? "disabled" : ""}>
        Send all to GitHub Issue
      </button>
      <div class="fo-sb-error" id="__fo_sb_err__"></div>
    </div>
  `;

  sidebar.querySelector("#__fo_sb_close__")?.addEventListener("click", () => {
    closeSidebar();
    opts.onClose();
  });

  const exportBtn = sidebar.querySelector<HTMLButtonElement>("#__fo_sb_export__")!;
  const errEl = sidebar.querySelector<HTMLElement>("#__fo_sb_err__")!;

  exportBtn.addEventListener("click", async () => {
    exportBtn.disabled = true;
    exportBtn.textContent = "Exporting…";
    errEl.textContent = "";
    try {
      await opts.onExportAll(allIds);
    } catch (err) {
      errEl.textContent = String(err);
      exportBtn.disabled = false;
      exportBtn.textContent = "Send all to GitHub Issue";
    }
  });

  // Animate in.
  requestAnimationFrame(() => sidebar!.classList.add("fo-open"));
}

export function updateSidebar(opts: SidebarOptions): void {
  // Re-render with fresh data if sidebar is already open.
  if (isSidebarOpen()) showSidebar(opts);
}

export function closeSidebar(): void {
  const el = document.getElementById(SIDEBAR_ID);
  if (!el) return;
  el.classList.remove("fo-open");
  // Remove after transition.
  setTimeout(() => el.remove(), 250);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
