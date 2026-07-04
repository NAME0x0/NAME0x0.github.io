# Task E6 — Chapter 6: Light (the cosmos)

Context: final film chapter phenomenon. Chapter 6 = AGI-Ledger — "each take a star in belief-space". Currently ch6 shows a leftover expanding torus shell (placeholder) plus fans assembling/spinning. Replace the placeholder with the real cosmos in components/film/scenes/ (new Cosmos.tsx layer + Machine.tsx wiring; Torus.tsx exit adjustments).

## Torus exit
The torus must be fully gone by ch6 presence 0.3: during the ch5→6 transition band the torus wireframe + nodes + routing light scale up slightly (~1.15x) and fade to 0 — no shell lingering through chapter 6.

## Cosmos — components/film/scenes/Cosmos.tsx
When chapter 6's presence rises, a star field blooms above the card:
- **Field**: ~900 points (single BufferGeometry + the existing glow-sprite technique, additive, depthWrite false) distributed in a flattened ellipsoid dome above the stage (radius ~4.5 x 2.6 x 3.5, centered ~2.2 above the die), deterministic golden-angle distribution. Sizes vary (0.02–0.07), colors: mostly ink-white #E8E4DE at low opacity, ~15% bone, a few ember accents. Gentle per-star twinkle via a time+seed phase in a custom shader or per-frame opacity attribute cycling (allocation-free — attributes preallocated).
- **Named takes**: 22 brighter stars (matching the ~22 seeded takes) — slightly larger, signal-tinted at ~30% mix, arranged in 4-5 loose clusters (faction clusters). These fade in AFTER the field (staggered by presence: field 0.0→0.5, named 0.4→0.8).
- **Entry**: stars grow from the card upward — initial positions compressed toward the card plane, easing to final dome positions with presence (lerp per star between start/end attribute pairs — precomputed, the ch3 morph pattern).
- **Exit into ch7**: stars settle downward toward the card and fade as chapter 7 begins (reverse of entry tied to ch7's early band), reading as light returning to the machine before power-down.
- Motes: ch6 motes take ink-white tint.

## Camera
Ch6 knots: recede and drift slightly upward so the dome fills the upper right of frame, card small at bottom with fans spinning (existing fan spin-up stays). Keep the framing bias (stars right-of-center; nothing over the copy column).

## Constraints & checks
Deterministic, allocation-free frames, no postprocessing/fetches/new deps, presence exclusivity respected (ch5 layer and ch6 layer crossfade only in the transition band). `npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report files + results.
