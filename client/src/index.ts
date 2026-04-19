// index.ts — feedback-overlay entry point.
// Bootstraps the entire overlay system when loaded as a <script> tag.

import { readConfig } from "./config";
import { APIClient, type FeedbackComment } from "./api";
import { AuthManager } from "./auth";
import { startActivationListener, onModeChange, forceMode, getMode } from "./activation";
import { highlight, clearHighlight } from "./highlighter";
import { renderBadges, clearBadges } from "./badge";
import { showSubmitDialog, showLoginDialog, closeDialog } from "./dialog";
import { showSidebar, closeSidebar, isSidebarOpen } from "./sidebar";
import { buildSelector } from "./selector";

(function bootstrap() {
  // Prevent double-init if the script is loaded more than once.
  if ((window as any).__feedbackOverlayLoaded) return;
  (window as any).__feedbackOverlayLoaded = true;

  const config = readConfig();
  const api = new APIClient(config);
  const auth = new AuthManager(config, api);

  // If any API call returns 401 the token has expired — clear the session so
  // the next element click will prompt for re-login instead of failing silently.
  api.setOnUnauthorized(() => auth.logout());

  // Cached comments for the current page (used to keep sidebar up to date).
  let pageComments: FeedbackComment[] = [];

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

    // Load badges + open sidebar.
    refreshPageData();
  }

  function deactivateOverlay(): void {
    document.body.style.cursor = "";
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("click", onElementClick, true);
    clearHighlight();
    clearBadges();
    closeDialog();
    closeSidebar();
  }

  async function refreshPageData(): Promise<void> {
    try {
      const [summaries, comments] = await Promise.all([
        api.listBadges(window.location.href),
        api.listComments(window.location.href),
      ]);
      pageComments = comments;
      renderBadges(summaries, onBadgeClick);
      // Open (or refresh) sidebar whenever overlay is active.
      openSidebar();
    } catch {/* non-fatal */}
  }

  function openSidebar(): void {
    showSidebar({
      comments: pageComments,
      onExportAll: async (ids) => {
        const result = await api.exportIssue({
          ids,
          repo: config.repo,
          labels: [config.label],
        });
        window.open(result.issue_url, "_blank");
        // Refresh after export (items become resolved).
        await refreshPageData();
      },
      onClose: () => {
        forceMode("idle");
      },
    });
  }

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  function onMouseOver(e: MouseEvent): void {
    const target = e.target as Element;
    if (!target || target === document.body || target === document.documentElement) return;
    if (isOwnElement(target)) return;
    highlight(target);
  }

  function isOwnElement(el: Element): boolean {
    return el.id.startsWith("__fo_");
  }

  // ── Element click — add a comment ───────────────────────────────────────────
  async function onElementClick(e: MouseEvent): Promise<void> {
    const target = e.target as Element;
    if (!target || isOwnElement(target)) return;

    e.preventDefault();
    e.stopPropagation();

    if (getMode() !== "active") return;

    const selector = buildSelector(target);
    const context = gatherContext(target);

    forceMode("capturing");

    // Stop element highlighting — we're done selecting.
    document.body.style.cursor = "";
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("click", onElementClick, true);
    clearHighlight();

    // Ensure authenticated.
    if (!auth.isAuthenticated()) {
      await new Promise<void>((resolve, reject) => {
        showLoginDialog({
          onLogin: async () => { await auth.login(); resolve(); },
          onCancel: () => { forceMode("idle"); reject(new Error("cancelled")); },
        });
      }).catch(() => { return; });
    }

    if (!auth.isAuthenticated()) return;

    const user = auth.getUser()!;

    forceMode("commenting");

    showSubmitDialog({
      selector,
      context,
      user,
      onSubmit: async (comment) => {
        await api.createFeedback({
          url: window.location.href,
          selector,
          comment,
          context,
          repo: config.repo,
          label: config.label,
        });
        closeDialog();
        // Return to active mode and refresh sidebar + badges.
        forceMode("active");
        await refreshPageData();
      },
      onCancel: () => {
        // Return to active mode (keep sidebar open).
        forceMode("active");
        // Re-attach listeners manually since activateOverlay won't re-run
        // (mode is already "active" so onModeChange won't fire again).
        document.body.style.cursor = "crosshair";
        document.addEventListener("mouseover", onMouseOver, true);
        document.addEventListener("click", onElementClick, true);
      },
    });
  }

  // ── Badge click — just refresh/open sidebar (already showing all comments) ──
  function onBadgeClick(_ids: number[], _selector: string): void {
    openSidebar();
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
      viewport: { width: window.innerWidth, height: window.innerHeight },
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
  }

  function gatherAttributes(el: Element): Record<string, string> {
    const out: Record<string, string> = {};
    for (const attr of Array.from(el.attributes)) {
      if (attr.value.length < 200) out[attr.name] = attr.value;
    }
    return out;
  }
})();
