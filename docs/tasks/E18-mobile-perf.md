# Task E18 — Mobile performance (Lighthouse mobile perf 0.52 → target ≥0.85)

Measured mobile breakdown (moto-g4 / slow-4G / 4x CPU): FCP 1.3s (good), **LCP 4.8s (0.3)**, **TBT 1760ms (0.1)**, CLS 0.009 (perfect). Two root causes; fix both without changing the desktop experience.

## 1. LCP — stop hiding the hero headline (biggest single win)
The hero `<h1>` (the lockup) is the LCP element. ScrollFX sets it to opacity 0 via `gsap.set` and only reveals it after GSAP loads + runs, so LCP waits ~4.8s.
- On **coarse-pointer / touch** devices (`window.matchMedia("(pointer: coarse)")`), SKIP the hero headline reveal entirely — the h1 renders visible at FCP (no gsap.set hiding it). Other reveals may stay but must ALSO not hide above-the-fold LCP-candidate text on mobile.
- On desktop, keep the masked line-rise on the hero as-is.
- General rule for ScrollFX: never leave any element that is in the initial viewport at opacity 0 for more than a frame on mobile — prefer transform-only reveals for above-the-fold content, or skip them on coarse pointer. Below-the-fold reveals are fine (they don't affect LCP).

## 2. TBT — cut main-thread work on mobile
- **KineticWall**: on coarse-pointer OR viewport width < 768, render ONE static frame and do NOT start the rAF loop (the continuous canvas animation is the biggest sustained main-thread cost). Cursor-ripple + scroll-velocity brightening are desktop-only enhancements. Reduced-motion already static — extend the same static path to mobile.
- **ScrollFX GSAP init**: defer the dynamic `import("gsap")` + ScrollTrigger/SplitText setup until `requestIdleCallback` (fallback `setTimeout` ~200ms) AND only after first paint, so GSAP parse/exec doesn't block TTI/TBT during load. Reveals that would have fired for already-in-view elements should just resolve to their final visible state immediately if GSAP isn't ready.
- **framer-motion leaves** (CursorDot, Magnetic): must bail BEFORE importing framer-motion on coarse-pointer / reduced-motion (CursorDot is hidden on touch anyway; ensure the dynamic import never runs there). Confirm Magnetic also skips the import on touch.
- **FluidInk / film gate**: already gated (won't run on mobile GPUs / SwiftShader) — verify the gate check itself is cheap and runs after idle, not on mount synchronously.

## 3. Keep intact
- Desktop experience unchanged (full reveals, kinetic ripple, cursor dot, fluid ink).
- Reduced-motion still fully static.
- No-JS content still complete.
- All existing gates and behaviors.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`. If Chrome + lighthouse are available, run a local mobile Lighthouse on `/` and report the perf score + LCP + TBT; otherwise report that CI will measure. Report files changed.
