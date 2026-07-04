# Task E13 — Owner feedback round: hero caption, fluid weight, widget size/centering, paper dots, photo deck

## 1. Hero: remove the claims caption block
Delete the "14/14 claims verified…" caption + explainer + how-link from the hero entirely. The Reactor canvas stays. Relocate a CONDENSED single line into the Footer next to the last-commit line: `14/14 claims verified · {relative}` (mono, dim, `title` attr carries the explainer sentence "Every number on this site is checked against its repo README at build time; a mismatch fails the build."). Unverified state: `claims unverified — last verified {relative}`.

## 2. FluidInk: lighter in every sense
- Splat radius ~50% smaller; dye intensity ~40% lower; canvas element opacity 0.5 → 0.32.
- Sim grid 128 → 96; run simulation steps at half rate (every other rAF) — visual advection stays smooth at display rate, cost halves.
- Keep all gating/idle behavior.

## 3. Widgets: bigger, centered, sticky
- Containers: `aspect-square w-full max-w-[38rem]` (homepage AND case pages); on lg the widget wrapper gets `lg:sticky lg:top-24 self-start` so the visual rides alongside its copy through the section.
- EVERY scene (bars, council, torus, stars, reactor): recompose so the content is CENTERED in the canvas and fills ~75-80% of the frame — adjust each scene's camera distance/fov or group scale and vertical offset (current scenes sit small and low). Verify by rendering each and checking the subject's bounding circle occupies most of the canvas. This is the owner's second complaint about size — overshoot rather than undershoot.

## 4. Paper-section dots
The fixed KineticWall is covered by the opaque #human section. Add a tone variant: `<KineticWall tone="paper" />` rendered INSIDE #human (absolute inset-0, behind content, pointer-events-none): dots in soot-dark (#1C1A17 base breathing toward #8A8578) at low alpha over the paper background, same ripple/scroll behaviors. Refactor KineticWall to accept `tone: "void" | "paper"` and `position: "fixed" | "absolute"`. #human's inner content gets relative z above it.

## 5. PhotoDeck (ready before the photos exist)
- Server: lib/content/photos.ts — fs.readdir("public/photos") at build (graceful empty if missing dir), match convention: `professional.(png|jpe?g|webp)`, `pfp_N.*`, `goofy_N.*`. Export typed list { src, kind: "professional"|"profile"|"goofy", alt } (alt: "professional headshot" / "profile photo N" / "off duty N").
- Client: components/site/PhotoDeck.tsx — card-deck animation (fits the persona better than a carousel): photos stacked with slight deterministic rotation offsets (±3deg) like a dropped stack of prints; top card auto-advances every ~4s — slides up + fades while the next settles; click/tap advances immediately; pause on hover; loops. framer-motion (already installed, code-split like Magnetic). Reduced-motion: static 2-col grid, no cycling.
- Mount in #human (right column above Tangled). Renders NOTHING when no photos exist (zero layout artifact). Images via next/image (unoptimized is fine per config), rounded-none, border-soot/20.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report files + results.
