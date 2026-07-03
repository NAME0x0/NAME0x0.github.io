# Task E3 — Staging system refactor (owner design review, real-GPU pass)

Owner feedback, verbatim themes: (1) the die reads as "a random box with text"; (2) chapter phenomena overlap each other and the copy; (3) camera barely moves — center-locked, slight rotation only; (4) torus never fully visible; (5) left/right empty space unused; (6) AVA bars finish growing during scroll-INTO the section, beating the purpose; (7) "visuals must work together by separation, not compete."

This is one refactor in components/film/ (Machine.tsx, Die.tsx, Council.tsx, Torus.tsx): a **stage system** + **attention-timed choreography** + **real camera travel** + **die redesign**. No new deps, all existing constraints (allocation-free, deterministic, no postprocessing/fetches) stay.

## 1. The Stage
- Define a single stage anchor in Machine.tsx: `STAGE = new Vector3(2.5, 0, 0)` for wide viewports (copy occupies the left half; the right half is the theater). When canvas aspect < 1.05: `STAGE = (0, -1.6, 0)` (below copy). Everything — die, columns, council ring, torus, motes — positions RELATIVE to STAGE. Nothing except designed ambient motes may cross left of `x < 0.8` (world) on wide viewports: phenomena must never sit under the text column.
- Per-chapter phenomena get exclusive vertical bands within the stage (die at y≈0, effects above it) but the separation rule is TEMPORAL first (see §3).

## 2. Die redesign — it must read as a silicon package, not a box
- Rebuild as a BGA-style package: a thin substrate plate (2.6 × 2.6 × 0.06, near-black `#141210`, matte) with a smaller raised die on top (1.6 × 1.6 × 0.05, the current circuit-textured clearcoat surface), plus a ring of tiny gold-tinted pads around the die on the substrate top (instanced small boxes, ~48, `#C4B5A0` metallic, subtle).
- Engraving: "4 GB" only, small (~0.35 die-widths wide), etched in the die's corner — not centered billboard text. Move "NAME0x0" to a barely-visible silkscreen line on the SUBSTRATE edge (tiny). Both non-emissive at rest; circuit traces keep their faint emissive.
- Overall scale ~25% smaller than current. Idle float/rotation stays but subtler (±0.02, 0.03 rad/s).

## 3. Attention-timed choreography (the universal timing curve)
Replace all per-chapter effect timing with one shared envelope helper:
`presence(chapterLocal) = smoothstep(0.18, 0.45, cl) * (1 - smoothstep(0.82, 1.0, cl))`
- Effects are INVISIBLE before cl=0.18 of their own chapter — nothing pre-plays during scroll-in. Growth completes ~cl=0.45 (user has settled, copy is centered). Exit fade 0.82→1.0 overlaps the next chapter's entry for a crossfade that never exceeds ~20% combined overlap.
- HARD EXCLUSIVITY: at most one chapter layer above 0.25 presence at any time; enforce by computing presence for all layers each frame from the single (chapter, chapterLocal) pair — adjacent layers only, others hard-0 and `visible=false`.
- Motes: reduce to a tighter column above the die (spread radius ≤ 1.2), color follows the ACTIVE layer (signal for ch3, bone for ch4, mixed ternary for ch5), opacity multiplied by that layer's presence. No motes during ch0–2.

## 4. Real camera travel (per-chapter shot list)
Camera targets are (position, lookAt) pairs relative to STAGE, damp-lerped as now, but each chapter is a genuinely different shot. Wide-viewport table (mobile: same elevations, distances × 1.3, azimuths halved):
- ch0 Ignition: from (−1.5, 4.5, 8) push to (1.0, 3.0, 5.0), lookAt die — high 3/4 reveal.
- ch1 Metal: sweep to the die's LEFT side low — (−2.0, 1.2, 4.2) → (−0.5, 1.8, 3.4) — placeholder drift until assembly lands.
- ch2 Voice: settle frontal low — (0.5, 1.0, 4.8) → hold with micro-drift.
- ch3 Mind: low lateral dolly RIGHT of stage — (4.5, 1.4, 4.6) → (3.2, 2.0, 3.8) — columns read against void, die in lower third.
- ch4 Council: rise and orbit ~40° around the ring — (4.8, 3.4, 3.2) → (1.2, 3.8, 4.6); hold during veto beat (cl 0.70–0.85); push down toward die for the seal.
- ch5 Blueprint: pull back and UP far enough that the ENTIRE torus fits with ≥15% margin — (1.5, 5.2, 7.4) → slow 25° azimuth drift, lookAt torus center. Verify no clipping of the full donut at 1280×800.
- ch6 Light: continue receding — (0.5, 6.0, 9.5), torus fading (placeholder).
- ch7 Human: sink below board level, light dies — (0.5, 0.4, 5.5).
Also scale the torus to fit the stage: major R ≤ 1.3, tube r ≤ 0.45, floating ≤ 1.4 above die.

## 5. Verification aid
Add a dev-only debug readout: when URL has `film=force&hud=1`, render a tiny fixed DOM div (outside canvas) showing `chapter / chapterLocal / presence per layer` — helps owner + reviewer verify timing. Excluded in production paths otherwise (no cost when param absent).

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report files + results.
