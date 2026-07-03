export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstepRange(edge0: number, edge1: number, value: number) {
  const x = clamp01((value - edge0) / (edge1 - edge0));

  return x * x * (3 - 2 * x);
}

export function smoothstep(value: number) {
  return smoothstepRange(0, 1, value);
}

export function presence(chapterLocal: number) {
  return smoothstepRange(0.18, 0.45, chapterLocal) * (1 - smoothstepRange(0.82, 1, chapterLocal));
}

export function layerPresence(chapter: number, chapterLocal: number, layer: number) {
  return chapter === layer ? presence(chapterLocal) : 0;
}
