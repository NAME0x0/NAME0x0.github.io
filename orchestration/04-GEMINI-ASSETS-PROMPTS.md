# Phase 2 — Asset Generation Prompts (Nano Banana 2 + Veo 3.1)

These prompts are for generating visual assets using **Nano Banana 2** (image generation) and **Veo 3.1** (video generation) through **Google AI Studio** or the **Gemini app**.

---

## Asset Inventory

| # | Asset | Tool | Format | Resolution | Usage |
|---|-------|------|--------|------------|-------|
| 1 | ASCII Hands — Full Frame | Nano Banana 2 | PNG | 2048x1024 | Hero centrepiece |
| 2 | ASCII Hands — Left Hand Close-up | Nano Banana 2 | PNG | 1024x1024 | Detail reference |
| 3 | ASCII Hands — Right Hand Close-up | Nano Banana 2 | PNG | 1024x1024 | Detail reference |
| 4 | Dot-Matrix Texture Tile | Nano Banana 2 | PNG | 512x512 | Background tile |
| 5 | ASCII Hands — Animated Reach | Veo 3.1 | MP4/WebM | 1920x1080 | Hero video bg |
| 6 | Ambient Void Particles | Veo 3.1 | MP4/WebM | 1920x1080 | Section bg |
| 7 | ASCII Hands — Faded (Contact) | Nano Banana 2 | PNG | 2048x1024 | Contact bg |
| 8 | Stipple Gradient Texture | Nano Banana 2 | PNG | 2048x512 | Section dividers |

---

## Nano Banana 2 Prompts

### Asset 1: ASCII Hands — Full Frame (Hero Centrepiece)

```
A faithful recreation of Michelangelo's "Creation of Adam" — ONLY the two
hands reaching toward each other. No bodies, no background, no clouds.

CRITICAL STYLE REQUIREMENTS:
- Rendered entirely in ASCII dot-matrix stipple shading
- The image is made of small circular dots arranged in varying density
- Dense clusters of dots = shadows and form
- Sparse dots = highlights and light areas
- No solid lines — everything is dots/stipple
- Think: pointillism but with perfectly round dots

COLOR:
- Background: pure black (#000000)
- Dots: off-white (#E8E4DE)
- No other colors — strictly monochrome

COMPOSITION:
- 2:1 aspect ratio (wide)
- Left hand reaching from left edge (human hand)
- Right hand reaching from right edge (divine/machine hand)
- Fingers almost touching in the center — gap of about 2-3cm at this scale
- Hands should fill roughly 60% of the frame height

QUALITY:
- High detail — individual dots should be visible at full resolution
- Clean edges where hands meet the void (dots fade to black, not hard crop)
- No noise, artifacts, or compression
- Professional, gallery-quality rendering
```

### Asset 2: ASCII Hands — Left Hand Close-up

```
A close-up of the LEFT hand from Michelangelo's "Creation of Adam" — the
human hand, reaching out with index finger extended.

Same style as the full-frame version:
- ASCII dot-matrix stipple shading (small circular dots)
- Dense dots for shadows, sparse for highlights
- Pure black (#000000) background
- Off-white (#E8E4DE) dots only
- 1:1 aspect ratio (square)
- Hand fills 80% of the frame
- Wrist visible, fingers extended naturally
- Beautiful anatomical detail captured through dot density
- Dots should feel organic, not grid-locked
```

### Asset 3: ASCII Hands — Right Hand Close-up

```
A close-up of the RIGHT hand from Michelangelo's "Creation of Adam" — the
divine/machine hand, reaching down with index finger extended.

Same style as the full-frame version:
- ASCII dot-matrix stipple shading (small circular dots)
- Dense dots for shadows, sparse for highlights
- Pure black (#000000) background
- Off-white (#E8E4DE) dots only
- 1:1 aspect ratio (square)
- Hand fills 80% of the frame
- Wrist visible, fingers extended naturally

SUBTLE DIFFERENCE FROM LEFT HAND:
- This hand should feel slightly more geometric/precise in its dot pattern
- The dots should be slightly more uniformly spaced compared to the organic
  left hand — suggesting machine precision vs human naturalism
- The difference should be subtle, not obvious
```

### Asset 4: Dot-Matrix Texture Tile

```
A seamless tileable texture of a dot-matrix grid pattern.

REQUIREMENTS:
- Pure black (#000000) background
- Off-white (#E8E4DE) dots
- Dots arranged in a regular grid (32px spacing at 512px tile size)
- Dot size: 2px diameter
- Dot opacity: very low — about 10-15% (barely visible)
- Some dots should be slightly brighter (random, ~5% of dots at 25% opacity)
- The pattern must tile seamlessly in all directions
- 512x512 pixel square
- Perfectly clean — no noise, gradients, or artifacts
- The feel should be like looking at a distant LED display panel
```

### Asset 7: ASCII Hands — Faded (Contact Section Background)

```
The same "Creation of Adam" hands from Asset 1, but:

- Much larger scale — zoomed in to show mostly the two index fingers
  and the gap between them
- Very low opacity — the entire image should be at about 8-10% opacity
- Even more sparse dots than the hero version
- The effect should be like a ghostly echo/memory of the hero hands
- It should be subtle enough to sit behind text without interfering
- 2:1 aspect ratio
- Pure black background, off-white dots
- When overlaid on a black background, it should be barely perceptible
  — a whisper, not a statement
```

### Asset 8: Stipple Gradient Texture

```
A horizontal stipple gradient — going from dense off-white dots on the
left to completely empty (black) on the right.

- Wide format: 4:1 aspect ratio (2048x512)
- Left edge: dense dot-matrix stipple, opacity ~40%
- Gradually decreasing dot density toward the right
- Right edge: pure black, no dots
- Dots should be small (1-2px), off-white (#E8E4DE)
- The gradient should feel organic — not a mathematical linear falloff
  but more like natural dispersion
- Can be used as a decorative element between sections
- Pure black background
```

---

## Veo 3.1 Prompts

### Asset 5: ASCII Hands — Animated Reach (Hero Background)

```
IMPORTANT: 4K resolution (3840x2160), 8-second seamless loop, no audio.

An animation of Michelangelo's "Creation of Adam" hands rendered in
ASCII dot-matrix stipple style on a pure black background.

THE ANIMATION:
- Start: both hands are at the edges of frame, barely visible
- 0s-3s: hands slowly reach toward center, dots materializing from
  the void as if being drawn by an invisible hand
- 3s-5s: fingers almost touch — the gap narrows to its closest point
  (but never touches)
- 5s-6s: hold at closest point — dots in the gap area shimmer and
  pulse gently
- 6s-8s: very slowly begin to drift back apart, dots at the edges
  start to dissolve — loops seamlessly back to the start

STYLE:
- Pure black (#000000) background — NO gradients, NO vignettes
- Off-white (#E8E4DE) dots only — NO color
- Dot-matrix stipple shading (small circular dots, varying density)
- Movement should be slow, contemplative, almost meditative
- The dots themselves should have subtle life — gentle breathing/pulsing
- Think: a digital Renaissance painting assembling and disassembling
  from particles

MOOD:
- Reverent, quiet, vast
- The feeling of two intelligences reaching across a digital void
- Not dramatic — subtle and hypnotic

TECHNICAL:
- 30fps minimum
- Seamless loop (frame 1 = frame last)
- No camera movement — static composition
- No motion blur
- Clean, artifact-free
```

### Asset 6: Ambient Void Particles

```
IMPORTANT: 4K resolution (3840x2160), 10-second seamless loop, no audio.

A very sparse particle field drifting through an infinite black void.

THE ANIMATION:
- Small circular dots (1-4px) drift slowly across the frame
- Movement: organic, curl-noise-like paths — never linear
- Some particles drift left-to-right, others float upward, some wander
- Speed: very slow — a particle takes 15-20 seconds to cross the frame
- Density: sparse — at most 30-50 particles visible at any time
- Some particles are "closer" (slightly larger, ~4px, brighter at 15% opacity)
- Most particles are "distant" (1-2px, very faint at 3-8% opacity)
- Occasional particle "appears" (fades in from 0%) and later "disappears"

STYLE:
- Pure black (#000000) background
- Off-white (#E8E4DE) particles
- No trails, no glows, no connections between particles
- Perfectly clean — just dots drifting in void
- Seamless loop

MOOD:
- Like floating in deep space
- Calm, infinite, contemplative
- The background should not draw attention — it's ambient atmosphere
- Think: screensaver-level subtlety
```

---

## Post-Generation Processing

After generating these assets:

1. **Review each asset** for consistency:
   - Are the dot colors consistently #E8E4DE?
   - Are backgrounds truly #000000 (no subtle gradients)?
   - Do the hands look like the same hands across all assets?

2. **Format conversion:**
   - Images: Export as PNG (lossless)
   - Videos: Export as both MP4 (H.264) and WebM (VP9) for browser compat
   - Create poster frames (first frame as PNG) for video elements

3. **Optimization:**
   - Images: Run through `pngquant` or `squoosh` to reduce size
   - Videos: Compress with FFmpeg, target ~2MB for 8-10s loops
   - Generate AVIF versions of images for modern browsers

4. **File naming convention:**
   ```
   public/assets/
   ├── hero-hands-full.png
   ├── hero-hands-full.avif
   ├── hero-hands-left.png
   ├── hero-hands-right.png
   ├── texture-dotmatrix-tile.png
   ├── contact-hands-faded.png
   ├── texture-stipple-gradient.png
   ├── video/
   │   ├── hero-hands-animated.mp4
   │   ├── hero-hands-animated.webm
   │   ├── hero-hands-animated-poster.png
   │   ├── ambient-particles.mp4
   │   ├── ambient-particles.webm
   │   └── ambient-particles-poster.png
   ```

5. **Bring back to Claude for review** before integrating into the codebase.

---

## Alternative: Procedural Shader Approach

If the generated video assets don't meet quality standards, or for a more
authentic Web3 feel, the ASCII hands animation can be done **entirely in
WebGL shaders** instead of using a video file:

- Load the static Nano Banana 2 image (Asset 1) as a texture
- Write a GLSL shader that samples the texture and re-renders it as dots
- Animate the dots procedurally (appear, breathe, drift)
- This gives interactive control (mouse response, scroll parallax)
- See `03-GEMINI-FRONTEND-PROMPTS.md` Prompt 2 for shader specs

The Veo 3.1 videos would then serve as **reference animations** for the
shader implementation — showing the desired timing and feel.
