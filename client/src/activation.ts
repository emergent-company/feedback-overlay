// activation.ts — configurable hold-to-activate key detection and overlay mode state machine.

import type { OverlayConfig } from "./config";

export type OverlayMode = "idle" | "active" | "capturing" | "commenting";

type ModeChangeCallback = (mode: OverlayMode) => void;

let mode: OverlayMode = "idle";
let listeners: ModeChangeCallback[] = [];

// Which modifier keys must both be held to activate.
let modifierA = "Alt";   // primary (e.g. Alt, Control, Meta)
let modifierB = "Shift"; // always Shift

let modADown = false;
let modBDown = false;

function setMode(next: OverlayMode): void {
  if (mode === next) return;
  mode = next;
  listeners.forEach((fn) => fn(next));
}

export function getMode(): OverlayMode {
  return mode;
}

export function onModeChange(cb: ModeChangeCallback): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((fn) => fn !== cb);
  };
}

export function forceMode(next: OverlayMode): void {
  setMode(next);
}

/** Starts listening for the configured hotkey combo. */
export function startActivationListener(config: Pick<OverlayConfig, "hotkey">): void {
  switch (config.hotkey) {
    case "ctrl+shift":  modifierA = "Control"; break;
    case "meta+shift":  modifierA = "Meta";    break;
    case "alt+shift":
    default:            modifierA = "Alt";     break;
  }

  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("keyup", handleKeyUp, true);
  // Reset if window loses focus.
  window.addEventListener("blur", reset);
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === modifierA) modADown = true;
  if (e.key === modifierB) modBDown = true;

  if (modADown && modBDown && mode === "idle") {
    setMode("active");
  }
}

function handleKeyUp(e: KeyboardEvent): void {
  if (e.key === modifierA) modADown = false;
  if (e.key === modifierB) modBDown = false;

  // Only deactivate while in element-selection mode ("active").
  // Once the user has clicked an element the mode advances to "capturing" or
  // "commenting" and the dialog must stay open regardless of key state.
  if (!modADown && !modBDown && mode === "active") {
    setMode("idle");
  }
}

function reset(): void {
  modADown = false;
  modBDown = false;
  // Only reset if the user hasn't already committed to a selection.
  if (mode === "active") setMode("idle");
}
