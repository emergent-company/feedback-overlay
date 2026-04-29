// indicator.ts — top bar shown while comment mode is active.

import type { OverlayConfig } from "./config";

const BAR_ID = "__fo_indicator__";

const STYLES = `
#${BAR_ID} {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  background: rgba(17, 24, 39, 0.92);
  backdrop-filter: blur(4px);
  border-bottom: 2px solid #22c55e;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #f9fafb;
  letter-spacing: 0.01em;
  pointer-events: none;
  box-sizing: border-box;
}
#${BAR_ID} .fo-bar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 8px;
  flex-shrink: 0;
  animation: fo-pulse 2s ease-in-out infinite;
}
#${BAR_ID} .fo-bar-key {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 4px;
  padding: 0 5px;
  margin: 0 2px;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11px;
  line-height: 18px;
}
@keyframes fo-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
`;

function hotkeyLabel(hotkey: OverlayConfig["hotkey"]): string {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  switch (hotkey) {
    case "ctrl+shift":  return "Ctrl+Shift";
    case "meta+shift":  return isMac ? "⌘+Shift" : "Win+Shift";
    case "alt+shift":
    default:            return isMac ? "⌥+Shift" : "Alt+Shift";
  }
}

let styleEl: HTMLStyleElement | null = null;
let barEl: HTMLElement | null = null;

const BAR_HEIGHT = 32;

export function showIndicator(hotkey: OverlayConfig["hotkey"]): void {
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  if (!barEl) {
    barEl = document.createElement("div");
    barEl.id = BAR_ID;
    document.body.appendChild(barEl);
  }

  const label = hotkeyLabel(hotkey);
  barEl.innerHTML =
    `<span class="fo-bar-dot"></span>` +
    `Comment mode\u2002—\u2002press\u00a0<span class="fo-bar-key">${label}</span>\u00a0to exit`;
  barEl.style.display = "flex";

  // Shift page content down so the bar doesn't cover anything.
  const current = parseInt(getComputedStyle(document.body).paddingTop, 10) || 0;
  document.body.dataset.foPaddingBefore = String(current);
  document.body.style.paddingTop = `${current + BAR_HEIGHT}px`;
}

export function hideIndicator(): void {
  if (barEl) barEl.style.display = "none";

  // Restore the original padding-top.
  const before = document.body.dataset.foPaddingBefore;
  if (before !== undefined) {
    document.body.style.paddingTop = before === "0" ? "" : `${before}px`;
    delete document.body.dataset.foPaddingBefore;
  }
}
