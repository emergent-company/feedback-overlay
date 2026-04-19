// index.ts — feedback-overlay entry point.
// Bootstraps the entire overlay system when loaded as a <script> tag.

import { readConfig } from "./config";
import { APIClient } from "./api";
import { AuthManager } from "./auth";
import { startActivationListener, onModeChange, forceMode, getMode } from "./activation";
import { highlight, clearHighlight, getHighlighted, getHighlightedSelector } from "./highlighter";
import { renderBadges, clearBadges } from "./badge";
import { captureElement } from "./screenshot";
import { showSubmitDialog, showLoginDialog, closeDialog } from "./dialog";
import { buildSelector } from "./selector";

(function bootstrap() {
  // Prevent double-init if the script is loaded more than once.
  if ((window as any).__feedbackOverlayLoaded) return;
  (window as any).__feedbackOverlayLoaded = true;

  const config = readConfig();
  const api = new APIClient(config);
  const auth = new AuthManager(config, api);

  // Try to restore existing session silently.
  auth.tryRestoreSession().catch(() => {/* silent */});

  startActivationListener();

  // ── Mode transitions ────────────────────────────────────────────────────────
  onModeChange(async (mode) => {
    if (mode === "active") {
      activateOverlay();
    } else if (mode === "idle") {
      deactivateOverlay();
    }
  });

  // ── Overlay activation ──────────────────────────────────────────────────────
  function activateOverlay(): void {
    document.body.style.cursor = "crosshair";
    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("click", onElementClick, true);

    // Load and render existing badges.
    api.listBadges(window.location.href).then((summaries) => {
      renderBadges(summaries, onBadgeClick);
    }).catch(() => {/* non-fatal */});
  }

  function deactivateOverlay(): void {
    document.body.style.cursor = "";
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("click", onElementClick, true);
    clearHighlight();
    clearBadges();
    closeDialog();
  }

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  function onMouseOver(e: MouseEvent): void {
    const target = e.target as Element;
    if (!target || target === document.body || target === document.documentElement) return;
    // Don't highlight our own overlay elements.
    if (isOwnElement(target)) return;
    highlight(target);
  }

  function isOwnElement(el: Element): boolean {
    return el.id.startsWith("__fo_");
  }

  // ── Element click ───────────────────────────────────────────────────────────
  async function onElementClick(e: MouseEvent): Promise<void> {
    const target = e.target as Element;
    if (!target || isOwnElement(target)) return;

    // Prevent the page's own click handlers from firing.
    e.preventDefault();
    e.stopPropagation();

    if (getMode() !== "active") return;

    const selector = buildSelector(target);
    const context = gatherContext(target);

    forceMode("capturing");

    // Ensure the user is authenticated before proceeding.
    if (!auth.isAuthenticated()) {
      await new Promise<void>((resolve, reject) => {
        showLoginDialog({
          onLogin: async () => {
            await auth.login();
            resolve();
          },
          onCancel: () => {
            forceMode("idle");
            reject(new Error("cancelled"));
          },
        });
      }).catch(() => { return; });
    }

    if (!auth.isAuthenticated()) return;

    const user = auth.getUser()!;

    // Capture screenshot.
    clearHighlight(); // hide highlight before capture for a cleaner shot
    const screenshot = await captureElement(target);

    forceMode("commenting");

    showSubmitDialog({
      selector,
      screenshotDataURL: screenshot?.dataURL ?? null,
      context,
      user,
      onSubmit: async (comment) => {
        await api.createFeedback({
          url: window.location.href,
          selector,
          comment,
          context,
          screenshot: screenshot?.dataURL,
          repo: config.repo,
          label: config.label,
        });
        forceMode("active");
        // Refresh badges.
        const summaries = await api.listBadges(window.location.href);
        renderBadges(summaries, onBadgeClick);
      },
      onCancel: () => {
        forceMode("idle");
      },
    });
  }

  // ── Badge click (show existing comments) ────────────────────────────────────
  function onBadgeClick(ids: number[], selector: string): void {
    // For now, open the export dialog for these items.
    // A future enhancement could show a read-only list inline.
    if (!auth.isAuthenticated()) {
      showLoginDialog({
        onLogin: async () => { await auth.login(); onBadgeClick(ids, selector); },
        onCancel: () => {},
      });
      return;
    }

    const user = auth.getUser()!;
    const DIALOG_ID = "__fo_dialog__";
    let dialog = document.getElementById(DIALOG_ID);
    if (!dialog) { dialog = document.createElement("div"); dialog.id = DIALOG_ID; document.body.appendChild(dialog); }

    dialog.innerHTML = `
      <div class="fo-card">
        <h2>${ids.length} comment${ids.length !== 1 ? "s" : ""} on this element</h2>
        <div class="fo-meta">${selector}</div>
        <div class="fo-user-bar">
          <img src="${user.avatarUrl}" alt="avatar">
          <span>Signed in as <strong>${user.login}</strong></span>
        </div>
        <div class="fo-actions">
          <button class="fo-btn-secondary" id="__fo_cancel__">Close</button>
          <button class="fo-btn-primary" id="__fo_export__">Export to GitHub Issue</button>
        </div>
        <div class="fo-error" id="__fo_err__"></div>
      </div>
    `;

    dialog.querySelector("#__fo_cancel__")?.addEventListener("click", () => { closeDialog(); });
    dialog.querySelector("#__fo_export__")?.addEventListener("click", async () => {
      const btn = dialog!.querySelector<HTMLButtonElement>("#__fo_export__")!;
      btn.disabled = true;
      btn.textContent = "Exporting…";
      try {
        const result = await api.exportIssue({ ids, repo: config.repo, labels: [config.label] });
        window.open(result.issue_url, "_blank");
        closeDialog();
        // Refresh badges after export (items become resolved).
        const summaries = await api.listBadges(window.location.href);
        renderBadges(summaries, onBadgeClick);
      } catch (err) {
        const errEl = dialog!.querySelector<HTMLElement>("#__fo_err__")!;
        errEl.textContent = String(err);
        btn.disabled = false;
        btn.textContent = "Export to GitHub Issue";
      }
    });
  }

  // ── Context collection ──────────────────────────────────────────────────────
  function gatherContext(el: Element): Record<string, unknown> {
    const rect = el.getBoundingClientRect();
    return {
      tagName: el.tagName.toLowerCase(),
      innerText: (el as HTMLElement).innerText?.slice(0, 200) ?? "",
      attributes: gatherAttributes(el),
      boundingRect: {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
  }

  function gatherAttributes(el: Element): Record<string, string> {
    const out: Record<string, string> = {};
    for (const attr of Array.from(el.attributes)) {
      // Skip large data URLs embedded in attributes.
      if (attr.value.length < 200) out[attr.name] = attr.value;
    }
    return out;
  }
})();
