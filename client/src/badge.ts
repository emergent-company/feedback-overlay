// badge.ts — numbered badge overlay showing existing comment counts.

import type { BadgeSummary } from "./api";

const BADGE_PREFIX = "__fo_badge__";
let activeBadges: HTMLElement[] = [];
let resizeObserver: ResizeObserver | null = null;

/** Removes all active badges from the page. */
export function clearBadges(): void {
  activeBadges.forEach((b) => b.remove());
  activeBadges = [];
  resizeObserver?.disconnect();
  resizeObserver = null;
}

/**
 * Renders badges for all summaries that have a matching element on the page.
 * Badges are absolutely positioned over the top-right corner of each element.
 */
export function renderBadges(summaries: BadgeSummary[], onBadgeClick: (ids: number[], selector: string) => void): void {
  clearBadges();

  summaries.forEach((s, i) => {
    let el: Element | null = null;
    try {
      el = document.querySelector(s.selector);
    } catch {
      return; // Invalid selector — skip.
    }
    if (!el) return;

    const badge = document.createElement("div");
    badge.id = `${BADGE_PREFIX}${i}`;
    badge.textContent = String(s.count);
    badge.title = `${s.count} comment${s.count !== 1 ? "s" : ""} on this element`;

    Object.assign(badge.style, {
      position: "absolute",
      background: "#f0a500",
      color: "#fff",
      fontSize: "10px",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      lineHeight: "1",
      padding: "2px 5px",
      borderRadius: "10px",
      zIndex: "2147483644",
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      minWidth: "16px",
      textAlign: "center",
    });

    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      onBadgeClick(s.ids, s.selector);
    });

    document.body.appendChild(badge);
    activeBadges.push(badge);

    positionBadge(badge, el);
  });

  // Reposition on scroll/resize.
  const reposition = () => {
    activeBadges.forEach((badge, i) => {
      const summary = summaries[i];
      if (!summary) return;
      let el: Element | null = null;
      try { el = document.querySelector(summary.selector); } catch { return; }
      if (el) positionBadge(badge, el);
    });
  };

  window.addEventListener("scroll", reposition, { passive: true });
  window.addEventListener("resize", reposition, { passive: true });

  resizeObserver = new ResizeObserver(reposition);
  resizeObserver.observe(document.body);
}

function positionBadge(badge: HTMLElement, el: Element): void {
  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  badge.style.top = `${rect.top + scrollY - 8}px`;
  badge.style.left = `${rect.right + scrollX - 8}px`;
}
