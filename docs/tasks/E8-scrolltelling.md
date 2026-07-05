# Task E8 — Scroll-telling pivot (owner direction)

Owner verdict: the 3D hero object experiment is paused. The GPU/ghost/die are UNMOUNTED (code stays; nothing renders them). The film keeps only light phenomena. The star of the site becomes GSAP scroll-telling in the DOM. gsap@3.15 is installed — SplitText and all plugins are now free and bundled.

## 1. Unmount the hero (components/film/scenes/Machine.tsx)
- Remove the `<Card>`/ghost mount and the FilmErrorBoundary wrapper around it, pointer-tilt plumbing, cardDimming plumbing, and the HUD assembled-count line. DO NOT delete Card.tsx or rail card logic files — unmounted, kept as elements for a future pass.
- Keep and re-center the light phenomena on the stage (they no longer share it with anything):
  - Bars (ch3): re-anchor to the stage center (x offsets around 0 relative to stage, spacing ~0.55), heights cap ~2.6, labels above, staggered.
  - Council (ch4) and Torus (ch5): keep exactly as-is (stage-anchored already).
  - AmbientField: keep, always-on, becomes the ch6 dome (unchanged).
- Camera anchors: keep the mid-chapter anchor rail; verify each phenomenon is fully framed right-of-center at its anchor with the hero gone (small lookAt tweaks allowed).

## 2. Kinetic wall — components/site/KineticWall.tsx ("use client")
A full-viewport 2D `<canvas>` fixed behind ALL content (z-index below main, pointer-events-none), for EVERY visitor (film on or off):
- Dot-matrix grid (~44px pitch, devicePixelRatio-aware). Each dot radius ~1.1px, color `#3A3832` (faint) with a slow breathing brightness toward `#8A8578` (dim); global opacity ~0.35 so effective visibility is subliminal (4-6%).
- Motion: dots breathe on a slow spatial wave (e.g. brightness = base + sin(t*0.4 + x*0.006 + y*0.004) * amp), plus the whole field drifts ~6px against scroll direction (read window.scrollY in the rAF, no scroll listeners).
- Performance: single rAF loop, pause on document.hidden and when `prefers-reduced-motion` (render one static frame). Redraw via canvas 2D — no WebGL. Resize handling with debounce.
- Mount once in app/layout.tsx (it must appear on every route). The film canvas (transparent) sits above it; the paper `#human` section and footer (opaque, z-1) cover it as they already do the film.

## 3. GSAP scroll-telling — components/site/ScrollFX.tsx ("use client")
One orchestrator component mounted on the homepage AND on /work/[slug] pages. Uses `gsap`, `ScrollTrigger`, `SplitText` (import from "gsap/ScrollTrigger", "gsap/SplitText", register once). Wrap EVERYTHING in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` so reduced-motion users get static content.
- **Masked line-rise**: for every element matching `[data-reveal="lines"]` (add this attr to the h1 hero lockup, every section h2, and case-study h1s): SplitText into lines with an overflow-hidden wrapper per line (SplitText `linesClass`), animate lines from yPercent 110 to 0, duration 0.9, ease "power4.out", stagger 0.08, triggered at "top 82%", once.
- **Overline + rule draw**: `[data-reveal="overline"]` (the `// SECTION` overlines): slide in x -16->0 + fade, and their section's top border (give sections a pseudo/border element or animate `scaleX` of an added rule span) draws 0->1 from left, 0.7s, ease "power2.out", once.
- **Row cascade**: `[data-reveal="row"]` (project rows, metric table rows): fade-up 14px, stagger 0.07 within their container, once.
- **Count-ups**: every MetricsTable value cell with `verified: true` gets `data-countup` (server component adds the attr + a `data-value` with the raw string). ScrollFX parses the LEADING numeric token (regex `^~?\d[\d,]*\.?\d*`), animates it 0 -> final over 1.15s ease "power2.out" with correct decimal places preserved, leaves the rest of the string static. Strings with no leading number are left alone. PROJECTED/unverified cells are NEVER animated (stillness marks the unproven — brand rule).
- **Parallax mix**: (a) `[data-parallax="soft"]` on section overlines: y drifts ±10px scrubbed; (b) section-level depth: each `<section>`'s inner container gets a scrubbed y drift of ~24px (enter to leave), creating gentle layer overlap WITHOUT pinning. No pin anywhere. (c) film side: AmbientField already scroll-coupled — add a small scroll-velocity drift factor to its uniform if trivial, else skip.
- Lenis coexistence: when `body[data-film="on"]`, Lenis animates native scroll so ScrollTrigger's default scroller works; still call `ScrollTrigger.refresh()` after fonts load and after film mount toggles. Listen for `resize`.
- Cleanup: full `ctx.revert()` / kill triggers on unmount.

## 4. Wire-in (server components add attributes only)
- app/page.tsx: add data-reveal attrs (h1 lockup = lines; every section h2 = lines; overlines = overline; ProjectRow roots = row) and mount `<ScrollFX />`.
- components/site/MetricsTable.tsx: add `data-countup` + `data-value` to verified value cells; add data-reveal="row" to rows.
- app/work/[slug]/page.tsx: h1 lines, section headers, MetricsTable rows, mount ScrollFX.
- app/layout.tsx: mount `<KineticWall />` before Header.
- Hero (ch0) name reveal plays on LOAD (not scroll-triggered): run the h1 SplitText timeline immediately on mount with a 0.15s delay.

## Constraints & checks
- No pinning. No scroll hijack beyond Lenis smoothing. All animation transform/opacity only. Reduced-motion = fully static (verify: matchMedia branch renders nothing animated and content is visible by default — IMPORTANT: initial states must be set via gsap.set inside the matchMedia context, never via CSS classes that hide content, so no-JS and reduced-motion users always see everything).
- `npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 150 kB (gsap core+ScrollTrigger+SplitText adds ~30 kB gz — report exact number).
- Report files + results.
