import { Vector3 } from "three";

export type RailKnot = {
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  cardPosition: [number, number, number];
  cardScale: number;
  cardDimming: number;
};

export type RailTrack = RailKnot[];

export type RailSample = {
  cameraPosition: Vector3;
  lookAt: Vector3;
  cardPosition: Vector3;
  cardScale: number;
  cardDimming: number;
};

export const wideRail: RailTrack = [
  { cameraPosition: [-1.5, 4.5, 8], lookAt: [-1.4, 0, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [1, 3, 5], lookAt: [-1.4, 0, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [-0.5, 1.8, 3.4], lookAt: [-1.4, 0.1, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [0.5, 1, 4.8], lookAt: [-1.4, 0.15, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [3.2, 2, 3.8], lookAt: [-1.4, 0.55, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [1.2, 3.8, 4.6], lookAt: [-1.4, 1.12, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [2.6, 6.6, 8.8], lookAt: [-1.6, 0.9, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [2.2, 7.2, 9.8], lookAt: [-1.4, 1, 0.1], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0 },
  { cameraPosition: [0.5, 0.4, 5.5], lookAt: [-1.4, 0.2, 0], cardPosition: [0, 0, 0], cardScale: 1, cardDimming: 0.9 },
];

export const narrowRail: RailTrack = wideRail.map((knot) => ({
  cameraPosition: [knot.cameraPosition[0] * 0.5, knot.cameraPosition[1], knot.cameraPosition[2] * 1.3],
  lookAt: [0, knot.lookAt[1], knot.lookAt[2]],
  cardPosition: [0, knot.cardPosition[1], knot.cardPosition[2]],
  cardScale: knot.cardScale,
  cardDimming: knot.cardDimming,
}));

export function easeInOutSine(t: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
}

export function sampleRail(track: RailTrack, chapter: number, chapterLocal: number, out: RailSample) {
  const index = Math.min(Math.max(chapter, 0), track.length - 2);
  const nextIndex = index + 1;
  const t = easeInOutSine(chapterLocal);
  const from = track[index];
  const to = track[nextIndex];

  out.cameraPosition.set(
    from.cameraPosition[0] + (to.cameraPosition[0] - from.cameraPosition[0]) * t,
    from.cameraPosition[1] + (to.cameraPosition[1] - from.cameraPosition[1]) * t,
    from.cameraPosition[2] + (to.cameraPosition[2] - from.cameraPosition[2]) * t,
  );
  out.lookAt.set(
    from.lookAt[0] + (to.lookAt[0] - from.lookAt[0]) * t,
    from.lookAt[1] + (to.lookAt[1] - from.lookAt[1]) * t,
    from.lookAt[2] + (to.lookAt[2] - from.lookAt[2]) * t,
  );
  out.cardPosition.set(
    from.cardPosition[0] + (to.cardPosition[0] - from.cardPosition[0]) * t,
    from.cardPosition[1] + (to.cardPosition[1] - from.cardPosition[1]) * t,
    from.cardPosition[2] + (to.cardPosition[2] - from.cardPosition[2]) * t,
  );
  out.cardScale = from.cardScale + (to.cardScale - from.cardScale) * t;
  out.cardDimming = from.cardDimming + (to.cardDimming - from.cardDimming) * t;

  return out;
}
