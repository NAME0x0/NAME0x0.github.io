import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
} from "three";

export const SIGNAL = "#E3B341";
export const DIM = "#8A8578";
export const EMBER = "#D08C5A";
export const BONE = "#C4B5A0";
export const INK = "#E8E4DE";

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(value: number) {
  const x = clamp01(value);

  return x * x * (3 - 2 * x);
}

export function smoothstepRange(edge0: number, edge1: number, value: number) {
  return smoothstep((value - edge0) / (edge1 - edge0));
}

export function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 124);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.24, "rgba(255, 255, 255, 0.48)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}
