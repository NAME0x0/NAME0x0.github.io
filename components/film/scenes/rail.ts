import { Vector3 } from "three";

export type RailAnchor = {
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
};

export type RailTrack = RailAnchor[];

export type RailSample = {
  cameraPosition: Vector3;
  lookAt: Vector3;
};

export const wideRail: RailTrack = [
  { cameraPosition: [1.6, 2.2, 8.6], lookAt: [-1.1, 0.1, 0] },
  { cameraPosition: [1.5, 2.1, 8.4], lookAt: [-1.08, 0.08, 0] },
  { cameraPosition: [1.75, 2.15, 8.55], lookAt: [-1.14, 0.1, 0] },
  { cameraPosition: [1.35, 1.95, 8.2], lookAt: [-1.02, 0.02, 0] },
  { cameraPosition: [1.9, 2.35, 8.75], lookAt: [-1.18, 0.18, 0] },
  { cameraPosition: [2.05, 2.3, 8.95], lookAt: [-1.24, 0.2, 0.05] },
  { cameraPosition: [1.8, 2.45, 8.8], lookAt: [-1.14, 0.28, 0.05] },
  { cameraPosition: [1.55, 2.1, 8.45], lookAt: [-1.08, 0.1, 0] },
];

export const narrowRail: RailTrack = wideRail.map((anchor) => ({
  cameraPosition: [anchor.cameraPosition[0] * 0.5, anchor.cameraPosition[1] + 0.25, anchor.cameraPosition[2] * 1.25],
  lookAt: [0, anchor.lookAt[1], anchor.lookAt[2]],
}));

export function easeInOutSine(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
}

export function sampleRail(track: RailTrack, chapter: number, chapterLocal: number, out: RailSample) {
  const t = chapter + chapterLocal;

  if (t <= 0.5) {
    out.cameraPosition.fromArray(track[0].cameraPosition);
    out.lookAt.fromArray(track[0].lookAt);

    return out;
  }

  const lastAnchor = track.length - 1;

  if (t >= lastAnchor + 0.5) {
    out.cameraPosition.fromArray(track[lastAnchor].cameraPosition);
    out.lookAt.fromArray(track[lastAnchor].lookAt);

    return out;
  }

  const index = Math.min(Math.max(Math.floor(t - 0.5), 0), track.length - 2);
  const u = easeInOutSine(t - (index + 0.5));
  const from = track[index];
  const to = track[index + 1];

  out.cameraPosition.set(
    from.cameraPosition[0] + (to.cameraPosition[0] - from.cameraPosition[0]) * u,
    from.cameraPosition[1] + (to.cameraPosition[1] - from.cameraPosition[1]) * u,
    from.cameraPosition[2] + (to.cameraPosition[2] - from.cameraPosition[2]) * u,
  );
  out.lookAt.set(
    from.lookAt[0] + (to.lookAt[0] - from.lookAt[0]) * u,
    from.lookAt[1] + (to.lookAt[1] - from.lookAt[1]) * u,
    from.lookAt[2] + (to.lookAt[2] - from.lookAt[2]) * u,
  );

  return out;
}
