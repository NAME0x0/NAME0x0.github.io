# Task E9 — Scene widgets (owner direction: baked-in animations in containers, no chapters)

The full-viewport film is UNMOUNTED (keep all components/film/ code; nothing renders it). Replace with bounded, self-contained WebGL scene widgets placed in the page layout. The site's fabric stays: KineticWall + ScrollFX.

## 1. components/widgets/SceneWidget.tsx ("use client")
A bounded container (`aspect-[4/3]`, w-full, max-w-[30rem]) holding a transparent R3F `<Canvas>`:
- Mounts its canvas only if the existing gate passes (reuse the FilmMount gate logic — extract it to `lib/film/gate.ts` as `checkFilmGate(): Promise<boolean>` used by both; keep `?film=force` override). Gate fail → render null (container collapses; server content unaffected).
- `frameloop`: "always" ONLY while the container is ≥25% in viewport (IntersectionObserver) AND document visible; otherwise "never".
- `dpr={[1, 1.5]}`, no postprocessing, no controls. Each scene owns a FIXED camera; nothing scrubs.
- Props: `scene: "bars" | "council" | "torus" | "stars"`. Entry animation: an internal 0→1 progress that eases in over ~1.4s the FIRST time the widget becomes visible (then stays 1); scenes use it exactly like the old presence value.

## 2. Four scenes — components/widgets/scenes/*.tsx (adapt from components/film/scenes/*)
Self-contained ports of the existing approved visuals, sized for a small canvas, deterministic + allocation-free as before:
- **BarsScene** (from the Machine bars): three benchmark columns (82.0 signal, 92.0 signal, 78.6 dim) + labels + base glows; entry = staggered grow; idle = subtle shimmer.
- **CouncilScene** (from Council.tsx): eleven-node ring + Eris offset; entry = sequential node fade-in; idle = the deliberation loop cycling continuously (exchanges → Eris flare → veto flash → seal → quiet → repeat, ~14s deterministic cycle).
- **TorusScene** (from Torus.tsx): wireframe torus + 128-node lattice; entry = wireframe draw-in (opacity); idle = routing light hopping forever, node highlights following.
- **StarsScene** (from AmbientField's ch6 behavior / old Cosmos): a small dome of ~300 stars + 22 brighter take-stars in clusters; entry = bloom from center; idle = twinkle + very slow rotation.
Each scene: own key/fill light where needed (bars/council/torus are additive self-lit — no lights needed), palette identical (signal/bone/ember/dim on transparent).

## 3. Placement
- **Homepage** (app/page.tsx): each tier-1 block (#mind AVA, #council Pantheon, #blueprint OMNI, #light AGI-Ledger) becomes a two-column grid on lg+: existing copy/table column (keep max-w-[68ch]) left, `<SceneWidget scene="...">` right (self-start, sticky-free). On <lg the widget renders ABOVE the metrics table, full width. Widget wrapper gets data-reveal="row" so ScrollFX cascades it in.
- **Case pages** (app/work/[slug]/page.tsx): map slug→scene (ava:bars, pantheon-trades:council, omni:torus, agi-ledger:stars); widget renders after the links row, before Problem. Width as spec'd above.
- **Unmount the film**: remove `<FilmMount />` from app/page.tsx (keep the file). The film-mode CSS (body[data-film] rules) stays in globals.css but never activates — the scene widgets don't set body dataset. ChapterTracker analytics stays (it's DOM-based).
- Lenis: no longer initialized anywhere (it was film-only). Native scroll everywhere — owner prefers the current no-film feel. Keep the dependency.

## 4. Constraints & checks
Deterministic, allocation-free frames, no fetches, no new deps. Reduced-motion / no-WebGL / low tier → no widgets, content complete. `npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 150 kB and report exact (three/R3F now loads only when a widget mounts — keep it code-split via next/dynamic inside SceneWidget). Report files + results.
