# Task E2 — Chapter 4 (The Council) + Chapter 5 (The Blueprint)

Context: continues the film in components/film/scenes/Machine.tsx (progress store, die group, chapter layers, allocation-free useFrame discipline all exist). Chapters 4 and 5 are procedural light phenomena above the die — same "computation made visible" language as chapter 3. Palette: `signal #E3B341` verified data, `bone #C4B5A0` accents, `ember #D08C5A` adversarial/warning, `dim #8A8578` baselines, void black. NO postprocessing, NO network assets, additive-blending glow (existing sprite technique).

Storyboard beats (docs/BRIEF.md §4):
- ch3→4 transition: the three benchmark columns split/dissolve into ELEVEN nodes.
- ch4: eleven agent lights deliberate in a ring ("chamber") above the die; arguments as light exchanges; Eris flares ember on the minority side; a veto flash; a refused trade "seals" (Proof of Restraint).
- ch4→5: the eleven nodes snap into a lattice.
- ch5: 8×4×4 expert lattice on a 3D torus above the die, wireframe/schematic; top-1 routing as light traveling the manifold; ternary particles in 3 visual states.
- ch5→6 placeholder: torus slowly expands/dims (stars land in a later task).

## Chapter 4 — components/film/scenes/Council.tsx (layer inside Machine)
- **Eleven nodes**: one InstancedMesh (sphere, small) + glow sprites, arranged in a ring (radius ~1.6) tilted slightly toward camera, floating ~1.6 above the die. Ten nodes `bone`; ERIS (index 10) `ember` and positioned slightly outside the ring — the dissenter sits apart.
- **Deliberation choreography** driven by chapterLocal:
  - 0.00–0.25 "openings": nodes fade in sequentially (staggered), gentle pulse.
  - 0.25–0.55 "exchanges": light arcs between random node pairs — implement as a pool of ~8 reusable arc lines (QuadraticBezierCurve3 sampled once into line geometries at layer init, positions rewritten from a precomputed pair schedule; opacity pulses travel along via vertex-color or opacity animation). Deterministic schedule (seeded array), not Math.random per frame.
  - 0.55–0.70 "Eris": exchanges quiet down; Eris flares ember, arcs from Eris to 3 nearest nodes.
  - 0.70–0.85 "veto": one bright flash — a node (Zeus, index 0) blinks white-hot once, all arcs cut.
  - 0.85–1.00 "restraint": a single vertical light descends from ring center to the die surface and stamps a small glowing ring decal on the die that persists until chapter end — the refusal, sealed.
- ch3's benchmark columns dissolve into the nodes during the transition band (columns shrink as nodes fade in — coordinate via chapter/chapterLocal, both layers visible in the band).

## Chapter 5 — components/film/scenes/Torus.tsx (layer inside Machine)
- **Torus wireframe**: TorusGeometry (major R ~1.5, tube r ~0.55) rendered as wireframe LineSegments (EdgesGeometry or wireframe material), `faint`-to-`bone` color, low opacity, floating above the die (die dims below). Schematic look: thin lines, no fill.
- **128 expert nodes**: InstancedMesh of 128 small boxes placed on the torus surface in an 8×4×4 arrangement: 8 positions around the major circle × 4 around the tube × 4 as concentric shells (tube radius offsets 0.40/0.50/0.60/0.70). Base color `dim`; instance color shifts to `bone` when "active".
- **Top-1 routing light**: one bright `signal` glow sprite traveling the manifold — moves along a precomputed path visiting a deterministic sequence of node positions (lerp along torus surface between consecutive nodes, ~1.2s per hop). The currently-visited node lights `signal`, its 6 lattice neighbors tint `bone`, all others `dim`. This is top-1 routing over the manifold, literally.
- **Ternary motes**: ~300 points in three discrete visual states cycling slowly: `ember` (-1), nearly-invisible `faint` (0), `bone` (+1) — reuse the chapter-3 mote system pattern with a per-particle state attribute; equal thirds.
- **Entry**: ch4's eleven nodes fly to the nearest lattice positions during the transition band (store 11 reserved lattice slots; lerp), then the remaining 117 fade in.
- **Exit placeholder**: torus + nodes slowly scale up ~1.4x and fade toward 0 opacity across chapter 6's band.

## Camera
- ch4: orbit around the ring chamber (~30° arc across the chapter), pause (hold position) during the veto beat 0.70–0.85, then slight push-down toward the die for the seal.
- ch5: pull back and up to reveal torus topology (target ~(0, 3.2, 5.2) looking at torus center), slow reveal drift across the chapter.
- Damped targets like existing chapters; extend the existing camera choreography switch.

## Constraints
- All geometry/materials/sprites created once at layer init (useMemo), disposed on unmount. Zero allocation in useFrame. Deterministic seeded schedules, no per-frame Math.random.
- Layers render nothing (visible=false / early return) outside their chapter band ± transition margin.
- No postprocessing, no fetches, no new deps, no drei Text.
- OMNI is a research project: nothing in ch5 may imply a running model — it's a schematic. (No copy changes needed; just no "live inference" labels.)
- `npx tsc --noEmit`, `npm run lint`, `npx next build` pass; `/` first-load JS stays ≤ 115 kB (film stays code-split). Report files + results + first-load JS.
