// screenshot.ts — best-effort element screenshot via html2canvas.
import html2canvas from "html2canvas";

export async function captureElement(el: Element): Promise<string | undefined> {
  try {
    const canvas = await html2canvas(el as HTMLElement, {
      logging: false,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      backgroundColor: null,
    });
    return canvas.toDataURL("image/png");
  } catch {
    return undefined;
  }
}
