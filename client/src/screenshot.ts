// screenshot.ts — captures a screenshot using getDisplayMedia() and crops it
// to the bounding rect of the target element.

export interface ScreenshotResult {
  dataURL: string; // base64 PNG data URL
}

/**
 * Captures the current tab and crops the image to the element's bounding rect.
 * Requires user to grant screen share permission (browser dialog).
 * Returns null if the user cancels or the API is unavailable.
 */
export async function captureElement(
  el: Element
): Promise<ScreenshotResult | null> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    console.warn("[feedback-overlay] getDisplayMedia not available.");
    return null;
  }

  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        // Ask for the current tab. Not all browsers honour this.
        // @ts-expect-error — non-standard but supported in Chrome
        preferCurrentTab: true,
        displaySurface: "browser",
      } as MediaTrackConstraints,
      audio: false,
    });
  } catch (err) {
    // User cancelled or permission denied.
    console.info("[feedback-overlay] Screen capture cancelled:", err);
    return null;
  }

  try {
    const track = stream.getVideoTracks()[0];
    // @ts-expect-error — ImageCapture is not yet in all TS libs
    const capture = new ImageCapture(track);
    const bitmap: ImageBitmap = await capture.grabFrame();

    // Crop to the element's bounding rect.
    const rect = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      bitmap,
      Math.round(rect.left * dpr),
      Math.round(rect.top * dpr),
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    bitmap.close();
    return { dataURL: canvas.toDataURL("image/png") };
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}
