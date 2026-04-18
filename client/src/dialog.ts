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
      background: rgba(0,0,0,0.45);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #__fo_dialog__ .fo-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px 24px;
      width: 480px;
      max-width: calc(100vw - 32px);
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 40px rgba(0,0,0,0.25);
    }
    #__fo_dialog__ .fo-card h2 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 600;
      color: #111;
    }
    #__fo_dialog__ .fo-card .fo-meta {
      font-size: 11px;
      color: #666;
      margin-bottom: 12px;
      font-family: monospace;
      word-break: break-all;
    }
    #__fo_dialog__ textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 10px;
      font-size: 13px;
      resize: vertical;
      min-height: 80px;
      box-sizing: border-box;
      outline: none;
    }
    #__fo_dialog__ textarea:focus { border-color: #4f86f7; }
    #__fo_dialog__ .fo-screenshot {
      margin-top: 10px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #eee;
    }
    #__fo_dialog__ .fo-screenshot img {
      display: block;
      max-width: 100%;
      max-height: 150px;
      object-fit: contain;
    }
    #__fo_dialog__ .fo-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 14px;
    }
    #__fo_dialog__ button {
      padding: 7px 16px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    #__fo_dialog__ .fo-btn-primary {
      background: #4f86f7;
      color: #fff;
    }
    #__fo_dialog__ .fo-btn-primary:hover { background: #3a6fd8; }
    #__fo_dialog__ .fo-btn-primary:disabled { background: #a0baf7; cursor: default; }
    #__fo_dialog__ .fo-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }
    #__fo_dialog__ .fo-btn-secondary:hover { background: #e0e0e0; }
    #__fo_dialog__ .fo-btn-danger {
      background: #e53e3e;
      color: #fff;
    }
    #__fo_dialog__ .fo-user-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #555;
    }
    #__fo_dialog__ .fo-user-bar img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    #__fo_dialog__ .fo-error {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 6px;
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
    }
    #__fo_dialog__ .fo-comment-list li:last-child { border-bottom: none; }
    #__fo_dialog__ .fo-comment-author {
      font-weight: 600;
      color: #333;
      margin-right: 4px;
    }
    #__fo_dialog__ .fo-comment-date {
      color: #999;
      font-size: 11px;
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

  dialog.innerHTML = `
    <div class="fo-card">
      <h2>Submit Feedback</h2>
      <div class="fo-meta">${escapeHtml(opts.selector)}</div>
      <div class="fo-user-bar">
        <img src="${escapeHtml(opts.user.avatarUrl)}" alt="avatar">
        <span>As <strong>${escapeHtml(opts.user.login)}</strong></span>
      </div>
      ${opts.screenshotDataURL ? `
        <div class="fo-screenshot">
          <img src="${opts.screenshotDataURL}" alt="Screenshot preview">
        </div>` : ""}
      <textarea id="__fo_comment__" placeholder="Describe the issue or leave a comment…"></textarea>
      <div class="fo-error" id="__fo_err__"></div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_submit__">Submit</button>
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
      submitBtn.textContent = "Submit";
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
    <div class="fo-card">
      <h2>Sign in with GitHub</h2>
      <div class="fo-meta">You need to sign in to submit feedback.</div>
      <div class="fo-actions">
        <button class="fo-btn-secondary" id="__fo_cancel__">Cancel</button>
        <button class="fo-btn-primary" id="__fo_login__">Login with GitHub</button>
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
      loginBtn.textContent = "Login with GitHub";
      const errDiv = document.createElement("div");
      errDiv.className = "fo-error";
      errDiv.textContent = String(err);
      loginBtn.parentElement?.insertAdjacentElement("beforebegin", errDiv);
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeDialog();
    opts.onCancel();
  });
}

export function closeDialog(): void {
  const dialog = document.getElementById(DIALOG_ID);
  if (dialog) dialog.innerHTML = "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
