// activation.ts — Alt+Shift hold detection and overlay mode state machine.

export type OverlayMode = "idle" | "active" | "capturing" | "commenting";

type ModeChangeCallback = (mode: OverlayMode) => void;

const ALT = "Alt";
const SHIFT = "Shift";

let mode: OverlayMode = "idle";
let listeners: ModeChangeCallback[] = [];
let altDown = false;
let shiftDown = false;

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

/** Starts listening for Alt+Shift key events. */
export function startActivationListener(): void {
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("keyup", handleKeyUp, true);
  // Reset if window loses focus.
  window.addEventListener("blur", reset);
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === ALT) altDown = true;
  if (e.key === SHIFT) shiftDown = true;

  if (altDown && shiftDown && mode === "idle") {
    setMode("active");
  }
}

function handleKeyUp(e: KeyboardEvent): void {
  if (e.key === ALT) altDown = false;
  if (e.key === SHIFT) shiftDown = false;

  // Deactivate when both keys released, regardless of current mode.
  // This ensures the user is never stuck if a dialog is dismissed externally.
  if (!altDown && !shiftDown && mode !== "idle") {
    setMode("idle");
  }
}

function reset(): void {
  altDown = false;
  shiftDown = false;
  if (mode !== "idle") setMode("idle");
}
