// highlighter.ts — element hover highlight (outline box + tooltip label).

import { buildSelector, elementLabel } from "./selector";

const OVERLAY_ID = "__fo_highlight__";
const TOOLTIP_ID = "__fo_tooltip__";

let currentEl: Element | null = null;

function getOrCreate(id: string, tag = "div"): HTMLElement {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement(tag);
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

/** Shows the highlight box and tooltip over el. */
export function highlight(el: Element): void {
  currentEl = el;
  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const box = getOrCreate(OVERLAY_ID);
  Object.assign(box.style, {
    position: "absolute",
    top: `${rect.top + scrollY}px`,
    left: `${rect.left + scrollX}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    outline: "2px solid #4f86f7",
    backgroundColor: "rgba(79, 134, 247, 0.08)",
    pointerEvents: "none",
    zIndex: "2147483645",
    boxSizing: "border-box",
    borderRadius: "2px",
    transition: "all 80ms ease",
  });

  const tip = getOrCreate(TOOLTIP_ID);
  tip.textContent = elementLabel(el);
  Object.assign(tip.style, {
    position: "absolute",
    top: `${rect.top + scrollY - 28}px`,
    left: `${rect.left + scrollX}px`,
    background: "#4f86f7",
    color: "#fff",
    fontSize: "11px",
    fontFamily: "monospace",
    padding: "2px 6px",
    borderRadius: "3px",
    pointerEvents: "none",
    zIndex: "2147483646",
    whiteSpace: "nowrap",
    maxWidth: "400px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });
}

/** Removes the highlight box and tooltip. */
export function clearHighlight(): void {
  currentEl = null;
  document.getElementById(OVERLAY_ID)?.remove();
  document.getElementById(TOOLTIP_ID)?.remove();
}

/** Returns the currently highlighted element. */
export function getHighlighted(): Element | null {
  return currentEl;
}

/** Returns the CSS selector for the currently highlighted element. */
export function getHighlightedSelector(): string | null {
  return currentEl ? buildSelector(currentEl) : null;
}
