/**
 * Scene Director — data model and interpolation for 3D scene parameters.
 * Each section of the portfolio maps to a target SceneParams state.
 * `computeSceneParams` linearly interpolates across a crossfade window
 * so transitions feel continuous rather than binary.
 */

export interface SceneParams {
  particleOpacity: number;
  particleSpeed: number;
  wallOpacity: number;
  wallEnergy: number;
  wallRevealTarget: number;
  waveOpacity: number;
  waveAmplitude: number;
}

interface SectionRange {
  start: number;
  end: number;
  params: SceneParams;
}

/** Crossfade half-width — blending window between adjacent sections */
const CROSSFADE = 0.04;

const SCENE_DIRECTOR: SectionRange[] = [
  {
    // hero (0–0.18): particles full, wall full, wave off
    start: 0,
    end: 0.18,
    params: {
      particleOpacity: 1.0,
      particleSpeed: 1.0,
      wallOpacity: 1.0,
      wallEnergy: 1.0,
      wallRevealTarget: 1.0,
      waveOpacity: 0,
      waveAmplitude: 0,
    },
  },
  {
    // stack (0.18–0.38): particles dim, wall energy high (grid shimmer), wave off
    start: 0.18,
    end: 0.38,
    params: {
      particleOpacity: 0.5,
      particleSpeed: 0.7,
      wallOpacity: 0.8,
      wallEnergy: 1.4,
      wallRevealTarget: 1.0,
      waveOpacity: 0,
      waveAmplitude: 0,
    },
  },
  {
    // projects (0.38–0.58): particles subtle, wall fading out, wave off
    start: 0.38,
    end: 0.58,
    params: {
      particleOpacity: 0.35,
      particleSpeed: 0.5,
      wallOpacity: 0.2,
      wallEnergy: 0.4,
      wallRevealTarget: 1.0,
      waveOpacity: 0,
      waveAmplitude: 0,
    },
  },
  {
    // about (0.58–0.80): particles calm/slow, wall off, wave off
    start: 0.58,
    end: 0.8,
    params: {
      particleOpacity: 0.25,
      particleSpeed: 0.3,
      wallOpacity: 0,
      wallEnergy: 0,
      wallRevealTarget: 0,
      waveOpacity: 0,
      waveAmplitude: 0,
    },
  },
  {
    // contact (0.80–1.0): particles faint, wall off, wave fading in
    start: 0.8,
    end: 1.0,
    params: {
      particleOpacity: 0.15,
      particleSpeed: 0.2,
      wallOpacity: 0,
      wallEnergy: 0,
      wallRevealTarget: 0,
      waveOpacity: 1.0,
      waveAmplitude: 1.0,
    },
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpParams(a: SceneParams, b: SceneParams, t: number): SceneParams {
  return {
    particleOpacity: lerp(a.particleOpacity, b.particleOpacity, t),
    particleSpeed: lerp(a.particleSpeed, b.particleSpeed, t),
    wallOpacity: lerp(a.wallOpacity, b.wallOpacity, t),
    wallEnergy: lerp(a.wallEnergy, b.wallEnergy, t),
    wallRevealTarget: lerp(a.wallRevealTarget, b.wallRevealTarget, t),
    waveOpacity: lerp(a.waveOpacity, b.waveOpacity, t),
    waveAmplitude: lerp(a.waveAmplitude, b.waveAmplitude, t),
  };
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Given a scroll position (0–1), compute blended scene parameters
 * by interpolating across section ranges with a crossfade window.
 */
export function computeSceneParams(scroll: number): SceneParams {
  const s = clamp01(scroll);

  for (let i = 0; i < SCENE_DIRECTOR.length - 1; i++) {
    const current = SCENE_DIRECTOR[i];
    const next = SCENE_DIRECTOR[i + 1];
    const boundary = current.end; // same as next.start

    // Are we within the crossfade window around this boundary?
    if (s >= boundary - CROSSFADE && s <= boundary + CROSSFADE) {
      const t = clamp01((s - (boundary - CROSSFADE)) / (CROSSFADE * 2));
      return lerpParams(current.params, next.params, t);
    }

    // Are we solidly inside the current section (before the crossfade)?
    if (s < boundary - CROSSFADE) {
      return current.params;
    }
  }

  // Past all boundaries — return last section
  return SCENE_DIRECTOR[SCENE_DIRECTOR.length - 1].params;
}

/* ─── Wall geometry constants ─────────────────────────── */

export const WALL_COLS = 48;
export const WALL_ROWS_DESKTOP = 32;
export const WALL_ROWS_TABLET = 24;
export const WALL_ROWS_MOBILE = 16;
export const WALL_TILE_SIZE = 0.065;
export const WALL_GAP = 0.008;

/* ─── Damping rate constants (used with THREE.MathUtils.damp) */

export const WALL_REVEAL_DAMP = 2.5;
export const WALL_OPACITY_DAMP = 4;
export const PARTICLE_OPACITY_DAMP = 4;
export const WAVE_OPACITY_DAMP = 3;
