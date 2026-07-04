# Task E15 — Torus fit, bar labels, intertitles, skeleton-resolve, scrubbed entrances, goofiness

## 1. Torus STILL clips
The declared bounding sphere underestimates the true extent: it must include the full torus (R + tube), the 128 node boxes at their outermost shell, the routing glow sprite, AND the ternary mote spread. Recompute as actual max extent × 1.08. Verify no clipping at aspect-square by projecting the extremes.

## 2. Bars: labels legible (DO NOT touch bar geometry)
Label sprites: double the rendered size and sharpen — canvas texture 1024×192, font ~92px bold mono, full-opacity color (signal for measured, dim for baseline). Keep positions non-overlapping (stagger heights as needed). Bars themselves unchanged.

## 3. Intertitles (once per section per view)
In ScrollFX: first time each homepage section crosses 30% viewport, an aria-hidden oversized display-font line — `04 — PROOF` style (number + overline word: IDENTITY/METAL/VOICE/PROOF/COUNCIL/BLUEPRINT/LIGHT/HUMAN) — sweeps horizontally across the section's top area: enters translateX(6vw) + opacity 0 → settles 0/1 (0.55s power3.out), holds ~0.6s, fades out 0.4s. Absolutely positioned inside the section, pointer-events-none, does not shift layout. Never repeats. Skip under reduced-motion. Skip #ignition (hero has its own load reveal).

## 4. Skeleton-resolve section loading
Below-fold homepage sections: on first approach (IO at ~45% viewport, BEFORE the reveal triggers), the section's inner container flashes a brief compute-in state: a mono-flavored shimmer overlay (repeating `▒` glyph pattern or a gradient shimmer band, `faint` on void / `soot/10` on paper) covering the content for ~220ms, then dissolving as the reveals fire. Implemented entirely via JS-applied overlay (no-JS users see plain content — never hide content in CSS). Once per view, reduced-motion skips.

## 5. Scrub-driven widget entrances
SceneWidget entry progress becomes scroll-driven while entering: progress = clamp01((viewportHeight - rect.top) / (viewportHeight * 0.7)), eased smoothstep, updated in the existing rAF — the visitor "drives" the bars growing / ring lighting / dome blooming as the widget rises into view. Once progress reaches 1 it LATCHES (idle loops take over; no reverse on scroll-up). Reduced-motion/gate-off unchanged (no canvas).

## 6. Terminal goofiness pack (components/site/Terminal.tsx)
New commands (update `help`; all responses obey banned-vocab rules):
- `sudo hire-me` → "escalating privileges... granted. CV: /cv/muhammad-afsah-cv.pdf — references available, refusals recorded on-chain." (link clickable)
- `vram` → ASCII meter animating over ~1.5s: `[####------------] 0.31 / 4.00 GB` with the line "this site knows the feeling."
- `matrix` → 8 seconds: scrollback rains random mono glyphs (append frames via the normal output path, capped), ends with "wake up, recruiter." then restores normal prompt. Reduced-motion: prints "no rain today." instead.
- `trackmania` upgrade → small ASCII track with a car glyph animating along the racing line for ~3s, then "improvement has no finish line."
- Idle self-typing: after 25s with zero interactions ever (this page view), the terminal ghost-types `help` character by character (600ms total), holds 2s, deletes it — a living hint. Happens once. Stops permanently on any real interaction. Skip under reduced-motion.
- Cursor companion: components/site/CursorDot.tsx — a 6px bone dot trailing the cursor with spring lag (motion values, code-split like Magnetic); blinks (scales briefly) after 10s idle; hidden on touch/reduced-motion. Mounted in layout. Subtle: opacity 0.5.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB. Report files + results.
