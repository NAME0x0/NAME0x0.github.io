# Task E5 — Assembly latch, ch5 envelope slide, torus placement, engraving removal

Owner feedback on real GPU. Four fixes in components/film/scenes/ (Card.tsx, Machine.tsx, rail.ts, Torus.tsx):

## 1. Card slide belongs INSIDE chapter 5 (currently smears across chapter 4)
The "card slides away" state is authored as rail boundary knots, so chapter 4 eases toward it for its whole duration — the card visibly retreats during Pantheon. Fix: remove the slide from the rail knots (card rail position stays at its normal stage spot through boundaries 4,5,6). Apply the slide as an ADDITIVE OFFSET driven by an envelope inside chapter 5 only: `slide = envelope(cl) where envelope = smoothstep(0.0,0.30,cl) * (1 - smoothstep(0.70,1.0,cl))` at chapter 5, else 0; offset = slide * (-1.4, -1.7, 0.7) plus dimming = slide * 0.75. During ch4 the card is fully present and normal.

## 2. Assembly must LATCH (the GPU is never visibly rebuilt right now)
Per-group assembly progress currently follows its chapter envelope only — parts fly in during their chapter and then disappear when the envelope closes, and deep-linking mid-page shows nothing. Fix: per group with home chapter H:
`progress = 1 if chapter > H; envelopeIn(cl) if chapter === H; 0 if chapter < H`
where `envelopeIn = smoothstep(0.15, 0.55, cl)` — monotonic within the chapter, permanently 1 afterwards (no exit fade for assembly; parts are PERMANENT once attached). Opacity/positions derive from progress. Scrolling backwards may disassemble (progress follows the formula — acceptable and actually charming).

## 3. Remap components so the card's mass appears early
Current mapping hides the model's biggest meshes until ch7. New mapping by home chapter:
- ch1 Metal: `body` + `motherboard` + `back_shield` (the card's structural mass — the machine visibly exists from ch1 onward)
- ch2 Voice: `ports`
- ch3 Mind: `heatsink_front`
- ch4 Council: `fan_holder*` + `fan_ring*`
- ch6 Light: `fan` + `fan_2` (then spin-up as already implemented)
- ch7 Human: `cover`, `cover_left`, `cover_right` (the shroud closes — final act only)
Also ensure assembled parts are actually VISIBLE against the void: parts must not be dimmed outside ch5/ch7 (dimming multiplier 0 elsewhere), and confirm the card group receives the key/fill/rim lights (if the GLB materials render near-black, raise envMapIntensity or add a subtle dedicated fill toward the card).

## 4. Torus right-shift + die engraving removal
- Torus anchor: move +0.9 in x (further right of stage) and verify at 1440x900 that no part of the torus renders left of ~55% screen width and nothing clips it.
- Procedural die: REMOVE the "4 GB" engraving and the "NAME0x0" silkscreen entirely (owner request). The die keeps only its circuit texture. Delete the now-unused canvas text drawing code.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`. Report what changed per fix. HUD assembled-count should now be monotonically nondecreasing while scrolling down — state this explicitly after implementing.
