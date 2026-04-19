// index.ts — feedback-overlay entry point.

import { readConfig } from "./config";
import { APIClient } from "./api";
import { AuthManager } from "./auth";
import { startActivationListener, onModeChange, forceMode, getMode } from "./activation";
import { highlight, clearHighlight } from "./highlighter";
import { renderBadges, clearBadges } from "./badge";
import { showSubmitDialog, showLoginDialog, closeDialog } from "./dialog";
import { buildSelector } from "./selector";

(function bootstrap() {
  if ((window as any).__feedbackOverlayLoaded) return;
  (window as any).__feedbackOverlayLoaded = true;

  const config = readConfig();
  const api = new APIClient(config);
  const auth = new AuthManager(config, api);

  api.setOnUnauthorized(() => auth.logout());

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

    // Render badges for existing comments.
    api.listBadges(window.location.href)
      .then((summaries) => renderBadges(summaries, onBadgeClick))
      .catch(() => {});
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
    if (isOwnElement(target)) return;
    highlight(target);
  }

  function isOwnElement(el: Element): boolean {
    return el.id.startsWith("__fo_");
  }

  // ── Shared: open feedback dialog for an element ─────────────────────────────
  async function openFeedbackDialog(target: Element): Promise<void> {
    const selector = buildSelector(target);
    const context = gatherContext(target);

    forceMode("capturing");
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
      }).catch(() => {});
    }
    if (!auth.isAuthenticated()) return;

    const user = auth.getUser()!;

    // Fetch existing comments for this element.
    const allComments = await api.listComments(window.location.href).catch(() => []);
    const existingComments = allComments.filter((c) => c.selector === selector);

    forceMode("commenting");

    showSubmitDialog({
      selector,
      existingComments,
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
        // Refresh badges, return to active mode.
        const summaries = await api.listBadges(window.location.href).catch(() => []);
        renderBadges(summaries, onBadgeClick);
        forceMode("active");
      },
      onExport: async (ids) => {
        const result = await api.exportIssue({
          ids,
          repo: config.repo,
          labels: [config.label],
        });
        window.open(result.issue_url, "_blank");
        // Refresh badges after export.
        const summaries = await api.listBadges(window.location.href).catch(() => []);
        renderBadges(summaries, onBadgeClick);
        forceMode("active");
      },
      onCancel: () => {
        forceMode("active");
        // Re-attach listeners since mode was already "active".
        document.body.style.cursor = "crosshair";
        document.addEventListener("mouseover", onMouseOver, true);
        document.addEventListener("click", onElementClick, true);
      },
    });
  }

  // ── Element click ────────────────────────────────────────────────────────────
  async function onElementClick(e: MouseEvent): Promise<void> {
    const target = e.target as Element;
    if (!target || isOwnElement(target)) return;

    e.preventDefault();
    e.stopPropagation();

    if (getMode() !== "active") return;

    await openFeedbackDialog(target);
  }

  // ── Badge click — open the dialog for that element ──────────────────────────
  function onBadgeClick(_ids: number[], selector: string): void {
    // Find the element on the page matching the selector.
    let el: Element | null = null;
    try { el = document.querySelector(selector); } catch {}
    if (el) {
      openFeedbackDialog(el);
    }
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
