// history.ts — session event recorder (ring buffer).
// Starts on page load, captures last N events for feedback context.

import { buildSelector, nearestComponent } from "./selector";

export interface SessionEvent {
  type: "navigation" | "input" | "click";
  timestamp: string;
  data: Record<string, unknown>;
}

const MAX_EVENTS = 15;
let events: SessionEvent[] = [];
let started = false;
let lastInputKey = "";
let lastInputTime = 0;

function isOwnElement(el: Element): boolean {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    if (node.id && node.id.startsWith("__fo_")) return true;
    node = node.parentElement;
  }
  return false;
}

function pushEvent(type: SessionEvent["type"], data: Record<string, unknown>): void {
  events.push({ type, timestamp: new Date().toISOString(), data });
  if (events.length > MAX_EVENTS) events.shift();
}

export function startRecording(): void {
  if (started) return;
  if (window.top !== window.self) return;
  started = true;

  let currentUrl = window.location.href;

  window.addEventListener("popstate", () => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      pushEvent("navigation", { url: newUrl, previousUrl: currentUrl, title: document.title });
      currentUrl = newUrl;
    }
  });

  const origPushState = history.pushState.bind(history);
  history.pushState = function (this: History, ...args: Parameters<History["pushState"]>) {
    const prevUrl = window.location.href;
    origPushState(...args);
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      pushEvent("navigation", { url: newUrl, previousUrl: prevUrl, title: document.title });
      currentUrl = newUrl;
    }
  };

  const origReplaceState = history.replaceState.bind(history);
  history.replaceState = function (this: History, ...args: Parameters<History["replaceState"]>) {
    const prevUrl = window.location.href;
    origReplaceState(...args);
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      pushEvent("navigation", { url: newUrl, previousUrl: prevUrl, title: document.title });
      currentUrl = newUrl;
    }
  };

  document.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target || isOwnElement(target)) return;
    const tag = target.tagName.toLowerCase();
    if (tag !== "input" && tag !== "textarea") return;
    const el = target as HTMLInputElement;

    const selector = buildSelector(target);
    const component = nearestComponent(target);
    const key = `${selector}_${tag}`;
    const now = Date.now();

    if (key === lastInputKey && now - lastInputTime < 500) {
      const last = events[events.length - 1];
      if (last?.type === "input") {
        last.data.value = el.type === "password" ? "<password>" : el.value;
        last.timestamp = new Date().toISOString();
        lastInputTime = now;
        return;
      }
    }
    lastInputKey = key;
    lastInputTime = now;

    pushEvent("input", {
      selector,
      component,
      tagName: tag,
      inputType: el.type || "text",
      value: el.type === "password" ? "<password>" : el.value,
    });
  }, true);

  document.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target || isOwnElement(target)) return;
    if (target.tagName.toLowerCase() !== "select") return;
    const el = target as HTMLSelectElement;
    pushEvent("input", {
      selector: buildSelector(target),
      component: nearestComponent(target),
      tagName: "select",
      inputType: "select",
      value: el.value,
    });
  }, true);

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as Element;
    if (!target || isOwnElement(target)) return;
    const tag = target.tagName.toLowerCase();
    const role = target.getAttribute("role");
    if (tag !== "a" && tag !== "button" && role !== "button") return;
    const text = (target.textContent || "").trim().slice(0, 80);
    pushEvent("click", {
      selector: buildSelector(target),
      component: nearestComponent(target),
      tagName: tag,
      text,
    });
  }, true);
}

export function getHistory(): SessionEvent[] {
  return events.slice();
}

export function clearHistory(): void {
  events = [];
  lastInputKey = "";
  lastInputTime = 0;
}
