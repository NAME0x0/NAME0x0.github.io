# Task E14 — Feedback round 2

## 1. Reactor out of the hero
Remove the SceneWidget/reactor from the hero entirely (unmount; keep ReactorScene as an element). Hero right half returns to typography + numeral + atmosphere. Footer receipt line stays. Remove now-unused hero grid columns if any.

## 2. FluidInk: near-subliminal
Canvas opacity 0.32 → 0.18; dye intensity another ~40% down; splat radius another ~25% down. It should read as a faint breath of ink you only notice when looking for it.

## 3. Widget scenes: FIT, not fill
The recompose overshot — scenes now overflow and clip. Give SceneCanvas a shared fit contract: each scene declares its content bounding-sphere radius (constant per scene); the canvas camera is positioned so that sphere fits inside the frustum BOTH axes with a 12% margin (compute from fov + aspect at mount + resize). Apply to bars, council, torus, stars, reactor (even unmounted). Verify none of the five clips at aspect-square and at the stars' wide aspect (see §5).

## 4. Hero "Muhammad" descender clipped
The SplitText line masks (overflow-hidden wrappers) clip glyph edges (the "d"). Fix: after each reveal timeline completes, call the SplitText instance's revert() so the DOM returns to clean, unwrapped text (standard practice). Also add ~0.12em block padding + compensating negative margin on line wrappers DURING the animation so ascenders/descenders survive mid-animation too.

## 5. Stars widget: wide container
Per-scene container aspect: SceneWidget accepts an optional aspect prop. Stars uses `aspect-[16/9] max-w-[44rem]` (homepage + case page); others stay square. With §3's fit contract the dome must sit fully inside.

## 6. Paper dots: stationary (the fixed-wall feel)
The paper KineticWall currently scrolls with the #human section. Owner wants the dots stationary relative to the VIEWPORT (content scrolls past them, like the fixed void wall). Keep the canvas absolute inside the section (so the opaque paper still covers the void wall) but draw the grid in viewport space: each frame, offset the entire dot field by the section's current `getBoundingClientRect().top` (negated) so dot positions are viewport-anchored. Dots must line up with the same pitch as the void wall. Ripple/breathing behaviors unchanged.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report files + results.
