// dialog.ts — comment submission dialog and badge detail dialog.

const DIALOG_ID = "__fo_dialog__";
const STYLE_ID = "__fo_styles__";

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #__fo_dialog__ {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.55);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #__fo_dialog__ * { box-sizing: border-box; }
    #__fo_dialog__ .fo-card {
      background: #fff;
      border-radius: 10px;
      padding: 0;
      width: 680px;
      max-width: calc(100vw - 32px);
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    }
    #__fo_dialog__ .fo-header {
      padding: 16px 20px 12px;
      border-bottom: 1px solid #e8e8e8;
    }
    #__fo_dialog__ .fo-header h2 {
      margin: 0 0 2px;
      font-size: 15px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-header .fo-meta {
      font-size: 11px;
      color: #444;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      word-break: break-all;
    }
    #__fo_dialog__ .fo-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
    #__fo_dialog__ .fo-body.fo-no-screenshot {
      flex-direction: column;
      padding: 16px 20px;
    }
    #__fo_dialog__ .fo-form-col {
      flex: 1;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      min-width: 0;
    }
    #__fo_dialog__ .fo-screenshot-col {
      width: 220px;
      flex-shrink: 0;
      border-left: 1px solid #e8e8e8;
      background: #f7f7f7;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 16px 12px;
      overflow: hidden;
    }
    #__fo_dialog__ .fo-screenshot-col img {
      width: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
      object-fit: contain;
      max-height: 300px;
    }
    #__fo_dialog__ .fo-user-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #222;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-user-bar img {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }
    #__fo_dialog__ textarea {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 9px 11px;
      font-size: 13px;
      color: #111;
      resize: vertical;
      min-height: 90px;
      outline: none;
      line-height: 1.5;
      flex: 1;
    }
    #__fo_dialog__ textarea:focus { border-color: #4f86f7; box-shadow: 0 0 0 3px rgba(79,134,247,0.15); }
    #__fo_dialog__ textarea::placeholder { color: #999; }
    #__fo_dialog__ .fo-footer {
      padding: 12px 20px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      background: #fafafa;
    }
    #__fo_dialog__ button {
      padding: 7px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s;
    }
    #__fo_dialog__ .fo-btn-primary {
      background: #4f86f7;
      color: #fff;
    }
    #__fo_dialog__ .fo-btn-primary:hover { background: #3a6fd8; }
    #__fo_dialog__ .fo-btn-primary:disabled { background: #a0baf7; cursor: default; }
    #__fo_dialog__ .fo-btn-secondary {
      background: #efefef;
      color: #222;
    }
    #__fo_dialog__ .fo-btn-secondary:hover { background: #e0e0e0; }
    #__fo_dialog__ .fo-btn-danger {
      background: #e53e3e;
      color: #fff;
    }
    #__fo_dialog__ .fo-error {
      color: #c53030;
      font-size: 12px;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-screenshot-label {
      font-size: 10px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    #__fo_dialog__ .fo-comment-list {
      list-style: none;
      padding: 0;
      margin: 0 0 12px;
    }
    #__fo_dialog__ .fo-comment-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
      color: #222;
    }
    #__fo_dialog__ .fo-comment-list li:last-child { border-bottom: none; }
    #__fo_dialog__ .fo-comment-author {
      font-weight: 600;
      color: #111;
      margin-right: 4px;
    }
    #__fo_dialog__ .fo-comment-date {
      color: #888;
      font-size: 11px;
    }
    /* Login dialog */
    #__fo_dialog__ .fo-login-card {
      background: #fff;
      border-radius: 10px;
      padding: 28px 28px 20px;
      width: 360px;
      max-width: calc(100vw - 32px);
      box-shadow: 0 12px 48px rgba(0,0,0,0.3);
    }
    #__fo_dialog__ .fo-login-card h2 {
      margin: 0 0 6px;
      font-size: 16px;
      font-weight: 700;
      color: #0f0f0f;
    }
    #__fo_dialog__ .fo-login-card .fo-meta {
      font-size: 13px;
      color: #444;
      margin-bottom: 20px;
    }
    #__fo_dialog__ .fo-login-card .fo-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `;
  document.head.appendChild(style);
}

function getOrCreateDialog(): HTMLElement {
  let el = document.getElementById(DIALOG_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = DIALOG_ID;
    document.body.appendChild(el);
  }
  return el;
}

export interface SubmitFeedbackOptions {
  selector: string;
  screenshotDataURL: string | null;
  context: Record<string, unknown>;
  user: { login: string; avatarUrl: string };
  onSubmit: (comment: string) => Promise<void>;
  onCancel: () => void;
}

/** Shows the "submit feedback" dialog. */
export function showSubmitDialog(opts: SubmitFeedbackOptions): void {
  injectStyles();
  const dialog = getOrCreateDialog();

  const hasScreenshot = !!opts.screenshotDataURL;

  dialog.innerHTML = `
    <div class="fo-card">
      <div class="fo-header">
        <h2>Submit Feedback</h2>
        <div class="fo-meta">${escapeHtml(opts.selector)}</div>
      </div>
      <div class="fo-body${hasScreenshot ? "" : " fo-no-screenshot"}">
        <div class="fo-form-col">
          <div class="fo-user-bar">
            <img src="${escapeHtml(opts.user.avatarUrl)}" alt="avatar">
            <span>Signed in as <strong>${escapeHtml(opts.user.login)}</strong></span>
          </div>
          <textarea id="__fo_comment__" placeholder="Describe the issue or leave a comment…"></textarea>
          <div class="fo-error" id="__fo_err__"></div>
        </div>
        ${hasScreenshot ? `
        <div class="fo-screenshot-col">
          <div>
            <div class="fo-screenshot-label">Screenshot</div>
            <img src="${opts.screenshotDataURL}" alt="Screenshot preview">
          </div>
        </div>` : ""}
      </div>
      <div class="fo-footer">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit Feedback</button>
      </div>
    </div>
  `;

  const textarea = dialog.querySelector<HTMLTextAreaElement>("#__fo_comment__")!;
  const submitBtn = dialog.querySelector<HTMLButtonElement>("#__fo_submit__")!;
  const cancelBtn = dialog.querySelector<HTMLButtonElement>("#__fo_cancel__")!;
  const errDiv = dialog.querySelector<HTMLElement>("#__fo_err__")!;

  textarea.focus();

  cancelBtn.addEventListener("click", () => {
    closeDialog();
    opts.onCancel();
  });

  submitBtn.addEventListener("click", async () => {
    const comment = textarea.value.trim();
    if (!comment) {
      errDiv.textContent = "Please enter a comment.";
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";
    errDiv.textContent = "";
    try {
      await opts.onSubmit(comment);
      closeDialog();
    } catch (err) {
      errDiv.textContent = String(err);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Feedback";
    }
  });

  // Close on backdrop click.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeDialog();
      opts.onCancel();
    }
  });

  // Close on Escape.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeDialog();
      opts.onCancel();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

export interface LoginDialogOptions {
  onLogin: () => Promise<void>;
  onCancel: () => void;
}

/** Shows a "login required" dialog before submitting feedback. */
export function showLoginDialog(opts: LoginDialogOptions): void {
  injectStyles();
  const dialog = getOrCreateDialog();

  dialog.innerHTML = `
    <div class="fo-login-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">Authentication required to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Sign in with GitHub</button>
      </div>
    </div>
  `;

  const loginBtn = dialog.querySelector<HTMLButtonElement>("#__fo_login__")!;
  const cancelBtn = dialog.querySelector<HTMLButtonElement>("#__fo_cancel__")!;

  loginBtn.addEventListener("click", async () => {
    loginBtn.disabled = true;
    loginBtn.textContent = "Opening…";
    try {
      await opts.onLogin();
      closeDialog();
    } catch (err) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign in with GitHub";
      const errDiv = document.createElement("div");
      errDiv.className = "fo-error";
      errDiv.style.marginTop = "8px";
      errDiv.textContent = String(err);
      loginBtn.parentElement?.insertAdjacentElement("afterend", errDiv);
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeDialog();
    opts.onCancel();
  });

  // Close on backdrop click.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeDialog();
      opts.onCancel();
    }
  });
}

export function closeDialog(): void {
  const dialog = document.getElementById(DIALOG_ID);
  if (dialog) dialog.remove();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
