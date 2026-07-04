# Task E7 — The Reduction (owner design direction: "less is more")

Design verdict from the owner: too many competing elements. New grammar, three layers only:
1. **The Machine** — the GLB card, portrait, static, assembling. The only hero.
2. **The Thought** — exactly one phenomenon at a time (existing bars / council / torus).
3. **The Void** — one always-on ambient particle background that becomes the ch6 cosmos.

Everything else is deleted. Files: components/film/scenes/* (Machine, Card, rail, Torus, Cosmos, Council, staging), app CSS/DOM for card sizing.

## 1. DELETE the procedural die/package entirely
Remove the substrate, raised die, pad ring, circuit canvas textures, ContactShadows, and every ref/material for them from Machine.tsx. The GLB card is the only object. Also remove the entire motes system (the ambient layer in §5 replaces it) and delete the separate Cosmos dome layer (merged into §5). Remove the ch5 card-slide envelope (a static hero never moves). Remove the cardLoaded procedural-fade logic.

## 2. GPU pose — portrait monolith, static
- Position: the current stage anchor (right half, clear of copy). NO positional animation of any kind, ever.
- Orientation: rotate 90° anticlockwise from the current pose so the card stands in PORTRAIT (long axis vertical). Front face (fans/shroud side) toward the camera, upright — verify visually that the face text/fans read the right way up (the owner reports the face is currently upside down; end state must be correct, add a one-line comment stating the intended orientation).
- Scale: large — ~3.4-3.8 world units tall.
- **Mouse tilt (only motion):** pointer position drives tilt up to ±0.06 rad on x/y, scaled by proximity of the pointer to the GPU's screen-space center (full effect within its bounds, fading to zero beyond ~1.6x bounds). Damped spring (lerp in useFrame, no react state). No tilt when the film HUD reduced-motion... (gate already prevents film under reduced-motion — fine).

## 3. Wireframe ghost (ch0 onward)
At load, build a ghost for each of the 8 component groups: EdgesGeometry (threshold ~30°) from each part's meshes rendered as LineSegments, faint bone (#C4B5A0) at ~0.16 opacity, additive. The full card outline is visible from chapter 0 — the blueprint standing in the void. As each part's assembly progress rises, its ghost opacity fades to 0 (real replaces plan). Ghost lines never move (same static pose).

## 4. Camera — mid-chapter anchors (owner's 0.500 system)
Re-author the rail: anchors are camera poses AT chapter midpoints (t = chapter + 0.5). Between consecutive anchors the camera glides on easeInOutSine over the span midpoint→midpoint (segment progress u = (t - (ch+0.5)) with t = chapter + chapterLocal, handle first/last half-chapters by clamping to the nearest anchor). Result: at every chapter's 0.500 the camera is at rest at its anchor; chapter boundaries have zero significance. Keep the damped follow on top.
- Anchor poses: SMALL variations only — reframes, not tours. Base pose showing the portrait card comfortably in the right half; per-chapter deltas within ±0.9 position units and small lookAt shifts (e.g. ch3 slightly lower/closer for the bars, ch5 slightly wider for the torus, ch6 slightly up for the sky, ch7 settle back). Framing bias stays.

## 5. The Void — one ambient system, always on
New AmbientField layer (replaces motes + Cosmos): ~700 points spread through the full visible volume (deep z-range, beyond and around the card), ink-white at 4-8% opacity, sizes 0.02-0.05, very slow deterministic drift (seeded phases). Always visible in every chapter — the background is alive from first frame to last.
- **Ch6 metamorphosis:** with ch6 presence, the field brightens (opacity toward ~0.5), stars grow slightly, and ~2/3 of the points lerp toward precomputed cluster positions in the upper sky (golden-angle clusters), plus the 22 named take-stars brighten with signal tint. With ch7, everything settles back to ambient. This is the merged cosmos — no separate dome.
- Keep the bars (ch3), council (ch4), torus (ch5) layers exactly as they are (owner approved them), presence exclusivity unchanged.

## 6. Assembly + fans
- Remap so assembly COMPLETES by end of ch6: ch1 body+motherboard+back_shield, ch2 ports, ch3 heatsink_front, ch4 fan_holder*+fan_ring*, ch5 nothing (torus solo), ch6 fan+fan_2 AND cover* (everything seated by cl≈0.7 of ch6).
- The moment all groups reach progress 1 (track a completion flag), fans spin up: static → 600rpm → 1200rpm crossfade over ~2s, and REMAIN spinning through ch7 (the finished machine runs; no power-down of the fans). Ch7 light dimming stays subtle (paper covers the canvas anyway; frameloop threshold stop stays).

## 7. DOM: uniform project cards/rows
- app/work/page.tsx tier-1 cards: equal heights (grid with auto-rows-fr; clamp taglines to 2 lines with line-clamp-2; metrics preview limited to a fixed count).
- Homepage ProjectRow rows: consistent min-height (e.g. min-h-[5.5rem]) and tagline line-clamp-2 so MALD/pane/MAVIS/Terminus rows are visually equal.
- Tier-2 rows on /work: same treatment.

## Constraints & checks
All existing: deterministic, allocation-free frames, no postprocessing/fetches/new deps, exclusivity. `npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report: everything DELETED (list), everything added, check results.
