# Task E4 — Keyframe rail (no boundary jumps) + GLB card assembly storytelling

Owner feedback: (1) at every chapter boundary (chapterLocal ~0) the die/camera visibly snaps — targets must flow continuously, "like sine waves"; (2) in ch5 the die sits inside the torus and kills it — during ch5 the card must move low-left and dim, torus owns the stage; (3) integrate public/models/rtx3080.glb; (4) NEW STORYTELLING: the GPU assembles across chapters — each chapter attaches components (progress made visible) while that chapter's phenomena play above.

## 1. Keyframe rail — components/film/scenes/rail.ts
Replace ALL per-chapter discrete camera/die targets with a keyframe system:
- `RailTrack`: array of 9 knots (values at chapter boundaries 0..8) for: cameraPosition (Vector3), lookAt (Vector3), cardPosition (Vector3), cardScale (number), cardDimming (0-1).
- `sampleRail(track, chapter, chapterLocal)`: `lerpVectors(knot[ch], knot[ch+1], easeInOutSine(chapterLocal))` where `easeInOutSine(t) = 0.5 - 0.5*cos(PI*t)`. Because knot[ch+1] is shared between adjacent chapters, the value is C0-continuous everywhere and its derivative is 0 at every boundary — smooth crest/trough exactly as requested. Keep the existing damp on top for scroll-velocity smoothing, but the TARGET no longer jumps.
- Wide-viewport knots must produce, per chapter, the same shots as now (high 3/4 reveal → left sweep → frontal → lateral dolly → council orbit high → far torus reveal → recede → sink), re-expressed as boundary values. The veto-hold beat in ch4 and framing bias stay (bias applied after sampling). Narrow-viewport knot set as before (centered stage, larger distances).
- **ch5 card knots**: by boundary 5 the card position eases to stage + (-1.2, -1.6, 0.6) with cardDimming → 0.75 (materials darkened, emissive off) and scale ~0.8; by boundary 6 it returns toward center-low for the cosmos; the torus floats at the stage center alone. The torus layer's anchor is now the STAGE, not the card.

## 2. GLB card — components/film/scenes/Card.tsx
- Load `/models/rtx3080.glb` with drei `useGLTF` with meshopt support (the file is meshopt-compressed: pass the meshopt decoder — `three/examples/jsm/libs/meshopt_decoder.module.js` is bundled locally, NO network fetch; wire via `useGLTF(url, true, true)` or extendLoader with `loader.setMeshoptDecoder(MeshoptDecoder)`).
- Lazy: `<Suspense fallback={null}>` INSIDE the scene so the film starts instantly with the existing procedural package; when loaded, the GLB group fades in over ~0.8s and the procedural package's substrate/pads fade out (the procedural DIE plate itself stays visible until ch1 attaches the GLB motherboard — the die is the seed of the machine).
- Normalize: compute bounding box once; recenter to origin, scale so the card's longest dimension ≈ 3.4 world units; orient lying flat (PCB horizontal, fans up), then parent into the rail-driven card group.
- Traverse once at load: collect named meshes into groups by name pattern: `motherboard`, `back_shield`, `ports`, `heatsink_front`, `fan_holder*` + `fan_ring*`, `fan` / `fan_2`, `cover*` + `body`. Store material references for dimming (cardDimming multiplies color/emissive intensity toward black).
- Fan animations exist in the GLB (`Armature|fan_static/600/1200/1500rpm`). Set up an AnimationMixer; crossfade between clips per chapter (see §3). Mixer.update in useFrame (allocation-free).

## 3. Assembly script (progress as story)
Each component group has an assembly state 0→1 driven by `presence`-style envelopes within its chapter (enter 0.20→0.55 of chapterLocal, eased): it flies from an offset (~1.2 units below + slight scatter, opacity 0) to its final local transform. Once assembled, it STAYS for all later chapters. Mapping:
- ch0 Ignition: procedural die only (unchanged).
- ch1 Metal: `motherboard` + `back_shield` assemble under the die (die visually seats onto the board as the PCB arrives — move the procedural die group to its socket position on the board during ch1).
- ch2 Voice: `ports` assemble (I/O — the interface layer, matching the chapter's theme and the terminal in the DOM).
- ch3 Mind: `heatsink_front` assembles quietly at LOW visual priority (columns own the attention); fan clip = static.
- ch4 Council: `fan_holder*` + `fan_ring*` assemble.
- ch5 Blueprint: NO assembly — card slides away (rail), torus alone. 
- ch6 Light: `fan` + `fan_2` assemble, then fans spin up: crossfade static → 600rpm → 1200rpm across the chapter (the machine breathes as the cosmos shines).
- ch7 Human: `cover*` + `body` (shroud) close over the card — the machine is complete — then fans crossfade to static and cardDimming → 0.9 as the lights die. Complete card, at rest, as the paper section covers it.
- If any expected name pattern is missing, log once in dev and treat that group as always-assembled (never crash).

## 4. Integration
- Machine.tsx consumes the rail for camera + card group; Council/Torus/columns anchor to STAGE (already) — only the torus must NOT track the card's ch5 slide.
- Existing presence exclusivity, motes, boot flash, seal, HUD (`hud=1` additionally shows assembled-group count) all stay.
- The old "procedural die scale/position" logic merges into the card group so there is ONE rail-driven transform.

## Constraints & checks
No network fetches (meshopt decoder is a local import; verify no CDN path). No postprocessing/new deps. Allocation-free frames (mixer + eased lerps reuse objects). `npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB (GLB must NOT enter the JS bundle — it streams from /public at runtime). Report files + results + confirmation that the GLB is runtime-fetched from /models/, not bundled.
