# Task E12 — The Claims Reactor (the signature, one-of-one)

The site's unique mechanism made visible: every hard number is machine-verified against source repos at build time. The Reactor performs this live in the hero. Nobody else has the pipeline, so nobody can copy the moment.

## Data — lib/content/claims.ts (server-safe)
Read + zod-validate `content/claims.json` (14 claims: id, value, repo, pattern, where) and `public/data/claims-status.json` ({ verifiedAt, status, results? }). Export a merged `getClaimsReceipts()`: per claim { id, value, repo, status: "verified"|"unverified", verifiedAt }. Human labels: derive a short display label from the id (e.g. "ava-arc-challenge" → "ARC-C 82.0%" — hand-map all 14 ids to display strings using the claim values; keep honest, value verbatim).

## Scene — components/widgets/scenes/ReactorScene.tsx (new SceneWidget scene "reactor")
Rendered in the HERO's right half (aspect-square, larger: max-w-[34rem]) via `<SceneWidget scene="reactor" data={receipts}>` — extend SceneWidget to pass optional serializable data to scenes.
- **The core**: a small pulsing signal-gold point at center (the build).
- **14 claim motes** orbit the core on 3 staggered elliptical rings (deterministic phase offsets), each a glow sprite + tiny mono canvas-texture label (its display value, e.g. "82.0%") that always faces camera; labels dim until stamped.
- **The stamping sequence** (entry, once, ~4s total): core flares → a light pulse travels to each claim in sequence (stagger ~0.22s) → on arrival the claim flares signal-gold and its label brightens to full — VERIFIED. After all 14: a thin ring draws around the whole system and a final subtle pulse. Idle after: slow orbit, gentle twinkle, core heartbeat every ~5s.
- **Unverified path**: if status is "unverified", claims stamp `dim` instead of signal and the DOM caption says so — honesty even about verification.
- Deterministic, allocation-free, additive blending, no postprocessing. Small-canvas discipline like other scenes.

## DOM frame around the widget (server component, works without WebGL)
Under the canvas: a mono caption block —
`14/14 claims verified against source repos · {relative verifiedAt}` (or `claims unverified — showing last verified state`), plus a one-line explainer: "Every number on this site is checked against its repo README at build time. A mismatch fails the build." and a small link `how? →` to `/writing/triton-fla-bitsandbytes-windows`? NO — link to the README section instead: link to `https://github.com/NAME0x0/NAME0x0.github.io#what-makes-it-unusual`. Caption renders for ALL visitors (gate-off users see caption + no canvas — the claim still lands textually).
- Hero layout: on lg+ the hero becomes two-column (copy left as-is, Reactor right, vertically centered); below lg the Reactor appears after the CTAs at full width (smaller).

## Analytics
Fire a `case_study_opened`-style event? NO new event types. Skip analytics for this task.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB (scene code stays inside the existing widget chunk). Verify hero copy column unaffected for gate-off users. Report files + results.
