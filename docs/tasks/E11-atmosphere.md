# Task E11 — Atmosphere pack (the soul layer)

Four layers, each independently removable, all palette-only, all OFF under reduced-motion/touch/save-data (reuse checkFilmGate where WebGL is involved). Z-order (bottom→top): KineticWall → FluidInk → chapter glow → ghost numerals → content.

## 1. Fluid ink cursor — components/site/FluidInk.tsx ("use client")
Full-viewport fixed WebGL2 canvas between the KineticWall and content: a compact stable-fluids simulation (vendor a minimal implementation adapted from Pavel Dobryakov's MIT WebGL-Fluid-Simulation — write it yourself, small: velocity + dye fields, half-float FBOs at 128-grid sim resolution, advection/divergence/pressure/gradient passes, no bloom/sunrays).
- Pointer movement splats velocity + dye. Dye color: bone #C4B5A0 at low intensity, every ~8th splat ember #D08C5A. Dissipation high (dye ~0.965, velocity ~0.98) — ink fades in ~2s.
- Composite: canvas opacity ~0.5, additive feel over void. Must never make text unreadable (test over the copy column).
- Gate: checkFilmGate() + no touch-primary (`(pointer: fine)`). Pause on document.hidden and when no pointer activity for 4s (skip sim steps while dye is fully faded). MIT attribution comment in the file header.

## 2. Reactive kinetic wall — upgrade components/site/KineticWall.tsx
- Dots within ~130px of the cursor displace radially away (max 6px) and brighten toward dim; eased recovery.
- Global brightness multiplier follows scroll velocity (rAF-computed delta of scrollY, smoothed): fast scroll = wall breathes up ~1.5x, settles in ~1s.
- Still one rAF, still 2D canvas, still static frame under reduced-motion.

## 3. Chapter-tinted glow — components/site/ChapterGlow.tsx ("use client")
One fixed, very soft radial gradient blob (~55vw, blur ~120px equivalent via gradient falloff, opacity ~0.10) positioned upper-right, drifting slowly (CSS animation, 40s loop). Its color crossfades by active section: ignition/metal/voice = bone; mind = signal; council = bone; blueprint = ember; light = ink-white; human/footer = transparent (paper section needs nothing). Active section via IntersectionObserver on the 8 section ids (reuse the ChapterRail's logic or a tiny shared hook). Homepage only. Pure DOM/CSS — works for every visitor. Reduced-motion: static color, no drift.

## 4. Ghost chapter numerals — homepage sections
Each of the 8 sections gets an aria-hidden absolutely-positioned numeral ("01".."08"): font-display, ~26vw, transparent fill with 1px stroke (`-webkit-text-stroke: 1px #3A3832`; fallback color transparent), right-aligned, overflowing slightly off-viewport right, z BELOW the section content, lg+ only. ScrollFX gives each a slow scrubbed parallax drift (y ±60px across the section's scroll span). Under reduced-motion: static.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB (FluidInk must be dynamically imported after idle/gate). Report files + results + exact first-load.
