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

export const ASSEMBLED_GROUP_TOTAL = 8;

function assemblyIn(chapterLocal: number) {
  return smoothstepRange(0.15, 0.55, chapterLocal);
}

function assemblyInLate(chapterLocal: number) {
  return smoothstepRange(0.15, 0.7, chapterLocal);
}

export function assembledGroupCount(chapter: number, chapterLocal: number) {
  let count = 0;

  if (chapter > 1) count += 3;
  else if (chapter === 1) count += assemblyIn(chapterLocal) * 3;

  if (chapter > 2) count += 1;
  else if (chapter === 2) count += assemblyIn(chapterLocal);

  if (chapter > 3) count += 1;
  else if (chapter === 3) count += assemblyIn(chapterLocal);

  if (chapter > 4) count += 1;
  else if (chapter === 4) count += assemblyIn(chapterLocal);

  if (chapter > 6) count += 2;
  else if (chapter === 6) count += assemblyInLate(chapterLocal) * 2;

  return count;
}
