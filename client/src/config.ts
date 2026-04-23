// config.ts — reads configuration from the <script> tag's data-* attributes.

export interface OverlayConfig {
  /** Base URL of the feedback-overlay API server. */
  apiBase: string;
  /** GitHub repo in "owner/repo" format. */
  repo: string;
  /** GitHub issue label to apply. Defaults to "feedback". */
  label: string;
  /**
   * Hotkey combination to activate the overlay.
   * Supported values: "alt+shift" (default), "ctrl+shift", "meta+shift".
   * Set via data-hotkey on the <script> tag.
   */
  hotkey: "alt+shift" | "ctrl+shift" | "meta+shift";
}

function getScriptTag(): HTMLScriptElement | null {
  // currentScript works when the script is first evaluated.
  if (document.currentScript instanceof HTMLScriptElement) {
    return document.currentScript;
  }
  // Fallback: find by src containing "feedback-overlay".
  return document.querySelector<HTMLScriptElement>(
    'script[src*="feedback-overlay"]'
  );
}

export function readConfig(): OverlayConfig {
  const tag = getScriptTag();
  const apiBase =
    tag?.dataset.api?.replace(/\/$/, "") ?? "https://feedback.emergent-company.ai";
  const repo = tag?.dataset.repo ?? "";
  const label = tag?.dataset.label ?? "feedback";
  const rawHotkey = tag?.dataset.hotkey?.toLowerCase() ?? "";
  const VALID_HOTKEYS = ["alt+shift", "ctrl+shift", "meta+shift"] as const;
  const hotkey: OverlayConfig["hotkey"] =
    (VALID_HOTKEYS as readonly string[]).includes(rawHotkey)
      ? (rawHotkey as OverlayConfig["hotkey"])
      : "alt+shift";

  if (!repo) {
    console.warn("[feedback-overlay] data-repo is not set on the <script> tag.");
  }

  return { apiBase, repo, label, hotkey };
}
