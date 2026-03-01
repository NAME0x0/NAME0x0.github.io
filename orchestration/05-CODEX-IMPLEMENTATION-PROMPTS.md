# Phase 4 — Codex Implementation Prompts (GPT-5.3-Codex xhigh)

These prompts are for **GPT-5.3-Codex** with **xhigh reasoning effort** on the **Codex CLI**. Each prompt is a self-contained implementation task. All review fixes from Claude have been pre-applied.

---

## CLI Configuration

```bash
codex --model gpt-5.3-codex --reasoning xhigh
```

---

## Pre-Prompt Context (provide at session start)

```
You are implementing a portfolio website redesign. Here is the full context:

PROJECT: Personal portfolio for Muhammad Afsah Mumtaz (NAME0x0)
REPO: https://github.com/NAME0x0/NAME0x0.github.io

STACK:
- Next.js 14 (static export, GitHub Pages via output: 'export')
- React 18 + TypeScript (strict mode)
- Three.js 0.179 / React Three Fiber 8 / Drei 9
- GSAP 3.12 + ScrollTrigger
- TailwindCSS 3.4
- SWR 2.3

DESIGN SYSTEM:
- Background: pure black #000000 ("void")
- Primary text: off-white #E8E4DE ("ink")
- Secondary text: #8A8578 ("ink-dim")
- Faint/dividers: #3A3832 ("ink-faint")
- Accent (hover): #C4B5A0 ("accent")
- Glass borders: rgba(232, 228, 222, 0.08) ("glass-stroke")
- Glass fills: rgba(232, 228, 222, 0.03) ("glass-fill")
- Typography: Space Grotesk (headings), Manrope (body), Geist Mono (code)

SECTION STRUCTURE (with terminal-style overline labels):
1. // INIT — Hero: ASCII Creation of Adam hands, name, role. NO tagline.
2. // ARCHITECTURE — Sovereign Stack: 5 tech layers (Foundation → Tools)
3. // DEPLOYMENTS — Projects: Filterable 2-col grid, 9 featured projects
4. // IDENTITY — About: Bio, capabilities, GitHub stats, language chart
5. // UPLINK — Contact: Email, socials, faded hands callback

FLAGSHIP PROJECT ORDER (proudest first):
OMNI > SMNTC > AVA > MALD > MAVIS > Terminus > Tangled > WebDesk > QuickTask

OMNI (crown jewel project):
- Sparse MoE 1.05T param LLM for 4GB VRAM via layer streaming + ternary inference
- Stack: Rust, tokio, ndarray, memmap2, rayon, SQLite, C/C++ FFI
- Layer: intelligence

CRITICAL CONSTRAINTS (violating these = rejected code):
1. output: 'export' in next.config.mjs — NO API routes, NO server-side anything
2. All Three.js components: dynamic(() => import(...), { ssr: false })
3. All GSAP animations MUST use gsap.context() for cleanup in useEffect
4. All scroll-entry animations MUST use once: true (except progress bar and parallax)
5. Respect prefers-reduced-motion — check via window.matchMedia, disable all
   animations and WebGL, show static fallbacks
6. Target 60fps on mid-range GPU (GTX 1060 / M1 equivalent)
7. No 'any' types. No type assertions without comments. Full interfaces.
8. Data comes from lib/data/ and lib/hooks/useGitHubPortfolioData.ts (existing)
9. NO new dependencies unless absolutely necessary
10. Card border-radius: 0.5rem (8px). NOT 1rem.

EXISTING DATA PIPELINE (DO NOT REPLACE):
- lib/data/curated.ts — project overrides, sovereign stack, profile identity
- lib/data/profile.ts — profile, capabilities, languageDistribution
- lib/data/projects.ts — project aggregation
- lib/github/client.ts — GitHub API client
- lib/github/fetch.ts — snapshot + live fetching
- lib/hooks/useGitHubPortfolioData.ts — SWR hook with snapshot fallback
- public/data/github-snapshot.json — build-time snapshot
```

---

## Implementation Task 1: Design Tokens, Global Styles, Tailwind Config

```
Update these three files for the new void + ink design system.

FILE 1: lib/design-system/tokens.ts
The file already exists with Gemini's updates. Make these corrections:
- Change components.card.borderRadius from "1rem" to "0.5rem"
- Change components.card.backdropFilter blur from "24px" to "12px"
- Change colors.glass.blur from "24px" to "12px"
- Ensure all exports match: colors, typography, spacing, shadows, animations,
  components, designTokens (default export)

FILE 2: app/globals.css
Complete rewrite:
- CSS reset (box-sizing, margin, padding)
- Body: background #000000, color #E8E4DE, font-family Manrope
- ::selection { background: #E8E4DE; color: #000000 }
- Scrollbar: thin, thumb #3A3832, track transparent (webkit + firefox)
- Reduced motion media query:
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
- Link hover underline utility class:
  .link-hover { position: relative; }
  .link-hover::after { ... scaleX(0) → scaleX(1) on hover, 0.25s ease-out }
- Glass card rotating border glow on hover (CSS conic-gradient approach):
  Use @property --angle, conic-gradient with mask-composite, 4s rotation.
  See the CSS from Gemini's shader spec Phase 3.2 section 4.
  Include prefers-reduced-motion fallback (simple border-color transition).
- Dot-matrix background utility:
  .bg-dotmatrix { background-image: radial-gradient(circle, #E8E4DE 0.5px,
  transparent 0.5px); background-size: 32px 32px; opacity: 0.05; }

FILE 3: tailwind.config.ts
IMPORTANT: EXTEND the default Tailwind breakpoints, do NOT replace them.
Use: screens: { ...require('tailwindcss/defaultTheme').screens, '2xl': '1440px' }

Extend theme with:
- colors: void, ink (DEFAULT/dim/faint), accent, glass (stroke/fill), semantic
- fontFamily: heading, body, mono (from tokens)
- fontSize: all fluid clamp() values from tokens (xs through display)
- spacing: add section-y, section-gap, card-padding as custom values
- boxShadow: glass, glow, glow-hover from tokens
- keyframes: dot-breathe, hand-reach, count-up, bar-fill from tokens
- animation: register all keyframes with appropriate durations
- borderRadius: glass (0.5rem)
- container: center: true, padding: '1rem', screens: { '2xl': '1200px' }

Write all three complete files. No placeholders.
```

---

## Implementation Task 2: Shared WebGL Scene + Shaders

```
Create the shared Three.js canvas and all shader components.

ARCHITECTURE (from Gemini, reviewed by Claude):
A single fixed-position <Canvas> sits behind all content, containing all
WebGL elements. This avoids multiple canvas instances and improves perf.

FILE 1: components/three/SceneContainer.tsx
- A fixed-position R3F <Canvas> covering the full viewport
- Position: fixed, inset: 0, z-index: 0 (behind content which has z-index: 1+)
- Canvas props: dpr={Math.min(window.devicePixelRatio, 2)}, gl={{ antialias: false,
  stencil: false, alpha: true, powerPreference: 'high-performance' }}
- Contains: <VoidParticles />, <AsciiHands />, <WaveSurface />
- Each child component manages its own visibility based on scroll position
- Accept a perfTier prop: 'desktop' | 'tablet' | 'mobile' | 'reduced'
- If perfTier === 'reduced': render nothing (return null), show CSS fallback

Performance tier detection (export as a hook: usePerformanceTier):
  const dpr = window.devicePixelRatio;
  const width = window.innerWidth;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReduced ? 'reduced' : width >= 1024 ? 'desktop' :
         width >= 768 ? 'tablet' : 'mobile';

Tier config:
  desktop: { dpr: min(dpr, 2), dotCount: 2000, particleCount: 200, waveSeg: 128 }
  tablet:  { dpr: min(dpr, 1.5), dotCount: 1000, particleCount: 120, waveSeg: 64 }
  mobile:  { dpr: 1, dotCount: 500, particleCount: 60, waveSeg: 32 }
  reduced: { disabled: true }

Props interface:
  export interface SceneContainerProps {
    scrollProgress: number;    // 0-1 total scroll
    activeSection: string;     // current section ID
    mousePosition: [number, number]; // normalized [-1,1]
  }

FILE 2: components/three/VoidParticles.tsx
Ambient particle drift throughout the page. Off-white dots on black void.

IMPORTANT: Do NOT use snoise/simplex noise. Use sin/cos combinations for drift:
  pos.x += sin(time * 0.15 + pos.y * 2.0 + randomOffset) * 0.08;
  pos.y += cos(time * 0.12 + pos.x * 1.5 + randomOffset * 2.0) * 0.06;
  pos.z += sin(time * 0.1 + randomOffset * 3.0) * 0.03;

Vertex shader uniforms: uTime (float), uScrollY (float)
- Particles have depth layers (z-axis) for parallax on scroll
- depthFactor = (pos.z + 5.0) / 10.0
- pos.y += uScrollY * mix(0.5, 2.0, depthFactor)
- gl_PointSize = mix(2.0, 4.0, depthFactor) * (uResolution.y / 800.0) *
  (300.0 / -modelViewPosition.z)
  (NOTE: use uResolution uniform, NOT magic number alone)

Fragment shader:
- Circle via discard if length(gl_PointCoord - 0.5) > 0.5
- Soft edge: smoothstep(0.5, 0.4, dist)
- Opacity: mix(0.03, 0.15, depthFactor)
- Color: vec3(0.91, 0.89, 0.87) — off-white #E8E4DE

Use THREE.Points with Float32Array buffer geometry.
Pre-allocate all arrays outside render loop. useRef for geometry/material.
Attributes: position (vec3), aRandomOffset (float) — set once on init.

Props interface:
  export interface VoidParticlesProps {
    count: number;
    scrollY: number;
    visible: boolean;
  }

FILE 3: components/three/AsciiHands.tsx
The centrepiece — Michelangelo's hands rendered as animated ASCII dot-matrix.

APPROACH: Fullscreen quad with custom ShaderMaterial that samples a texture
(the pre-generated Nano Banana 2 image) and re-renders it as dots.

Uniforms:
- uTexture: Texture2D (the hands image, loaded via useTexture from drei)
- uTime: float (animation time)
- uProgress: float (0→1, controls reveal. Animated on mount, parallax on scroll)
- uMouse: vec2 (normalized mouse position for interaction)
- uDotSize: float (base dot radius, default 0.008)
- uGridSize: float (dot spacing, default 0.006)
- uBreathIntensity: float (breathing amplitude, default 0.3)
- uResolution: vec2 (canvas resolution for proper scaling)

Vertex shader: Standard fullscreen quad (two triangles covering [-1,1]).
Pass UV to fragment.

Fragment shader:
  // Step 1: Snap UV to grid
  vec2 gridUV = floor(vUv / uGridSize) * uGridSize + uGridSize * 0.5;
  // Step 2: Sample texture at grid position
  vec4 texColor = texture2D(uTexture, gridUV);
  float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  // Step 3: Calculate dot
  vec2 cellUV = fract(vUv / uGridSize) - 0.5;
  float dist = length(cellUV);
  float radius = brightness * uDotSize / uGridSize;
  // Step 4: Breathing
  radius += sin(uTime * 2.0 + gridUV.x * 10.0 + gridUV.y * 7.0) *
            uBreathIntensity * brightness * 0.01;
  // Step 5: Reveal (left-to-right progress)
  float reveal = smoothstep(uProgress - 0.05, uProgress, gridUV.x);
  // Step 6: Mouse interaction (dots near cursor enlarge slightly)
  float mouseDist = distance(gridUV, uMouse * 0.5 + 0.5);
  float mouseEffect = smoothstep(0.15, 0.0, mouseDist) * 0.005;
  radius += mouseEffect;
  // Step 7: Render dot
  float dot = smoothstep(radius, radius - 0.001, dist);
  float alpha = dot * brightness * reveal;
  gl_FragColor = vec4(0.91, 0.89, 0.87, alpha);

React component:
- Renders a <mesh> with <planeGeometry args={[2, 2]} /> and the custom shader
- useFrame updates uTime
- Accept props: progress, mousePosition, visible, reducedMotion
- If reducedMotion or fallback: render nothing (parent handles CSS fallback)
- Dispose shader material on unmount via useEffect cleanup
- Memoize shader material with useMemo

Export interface:
  export interface AsciiHandsProps {
    progress: number;
    mousePosition: [number, number];
    visible: boolean;
  }

FILE 4: components/three/WaveSurface.tsx
Wireframe wave for the Contact section background.

IMPORTANT: Render as WIREFRAME, not solid surface.
Use: <meshBasicMaterial wireframe color="#E8E4DE" transparent opacity={0.08} />
Do NOT write a custom wireframe fragment shader — just use Three.js wireframe mode.

Vertex shader (displacement only):
  uniform float uTime;
  void main() {
    vec3 pos = position;
    // Multi-frequency wave for visual interest
    pos.z += sin(pos.x * 0.5 + uTime * 0.5) * 0.15;
    pos.z += sin(pos.x * 1.2 + pos.y * 0.8 + uTime * 0.7) * 0.05;
    pos.z += cos(pos.y * 0.3 + uTime * 0.3) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }

Use <planeGeometry> with configurable segments (from perf tier).
Position it in the lower portion of the scene.
Only visible when activeSection === 'contact'.

Props interface:
  export interface WaveSurfaceProps {
    segments: number;
    visible: boolean;
  }

FILE 5: lib/hooks/usePerformanceTier.ts
Export the performance tier detection hook described above.
Returns: { tier: PerfTier, config: TierConfig }
Run detection once on mount, cache in a ref.

Write all 5 complete files. Full TypeScript. All shaders as template literals.
```

---

## Implementation Task 3: Hero Section

```
Rebuild the Hero section component.

File: components/sections/Hero.tsx

LAYOUT:
- Full viewport height (100vh), min-height: 600px
- Centered content, flex column, items-center, justify-center
- Background: transparent (the SceneContainer renders behind)
- Position: relative, z-index: 1 (above the fixed canvas)

CONTENT (top to bottom):
1. A transparent div where the AsciiHands renders through (no component here —
   the hands are in SceneContainer, visible when hero is active)
   Just leave vertical space: h-[260px] on desktop, h-[160px] on mobile
2. Name: "MUHAMMAD AFSAH MUMTAZ" — <h1> with:
   font-family: heading, font-size: display (fluid clamp), font-weight: 700,
   color: ink, letter-spacing: -0.05em, text-center
3. Role: "SYSTEMS ARCHITECT · AI ENGINEER · OS DEVELOPER" — <p> with:
   font-family: mono, font-size: overline (0.75rem), letter-spacing: 0.12em,
   text-transform: uppercase, color: ink-dim, text-center
4. Scroll cue at bottom:
   - Absolute positioned, bottom-8, centered
   - Text "Scroll" in font-mono, text-xs, uppercase, tracking-widest, ink-dim
   - Below: 1px wide, 48px tall div with gradient from ink to transparent
   - Has subtle CSS pulse animation (opacity 0.4 → 0.8 → 0.4, 2s loop)
   - aria-hidden="true"

DATA:
- import { profile } from '@/lib/data/profile'
- Use profile.name and profile.title

ANIMATIONS (GSAP with gsap.context for cleanup):
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Check reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // On mount (NOT scroll-linked):
      gsap.fromTo(nameRef, { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 2.0, ease: 'power2.out' });
      gsap.fromTo(roleRef, { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 2.5, ease: 'power2.out' });
      gsap.fromTo(scrollCueRef, { opacity: 0 },
        { opacity: 0.6, duration: 0.5, delay: 3.0 });

      // On scroll (parallax + fade):
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(contentRef.current, { y: '-20%', opacity: 0 })
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

REDUCED MOTION:
- Name and role visible immediately (no animation, opacity: 1)
- No scroll parallax
- Scroll cue visible without pulse

MOBILE:
- Space for hands: h-[160px] instead of h-[260px]
- Name wraps to 2 lines naturally (fluid clamp handles size)

ACCESSIBILITY:
- <section id="hero" aria-label="Introduction">
- Name in <h1>
- Role in <p>

Write the complete component. NO dynamic import needed for Hero itself
(it's just HTML+GSAP). The WebGL hands are in SceneContainer.
```

---

## Implementation Task 4: Sovereign Stack Section

```
Rebuild the Sovereign Stack section.

File: components/sections/SovereignStack.tsx

LAYOUT:
- <section id="stack"> with min-h-screen, auto height
- Container: max-w-[1200px] mx-auto px-4 lg:px-16
- Section padding: py-[clamp(80px,7.6vw+50px,160px)] (from spacing.section-y)

CONTENT:
1. Overline: "// ARCHITECTURE" (font-mono, text-xs, tracking-[0.12em], uppercase,
   text-ink-dim, mb-3)
2. Heading: "THE STACK" (font-heading, text-3xl [fluid], font-semibold, text-ink, mb-2)
3. Subtext: "Building from bare metal to browser." (text-base, text-ink-dim, mb-12)
4. Stack layers — flex flex-col:
   Each row: flex items-start gap-6 py-6 border-b border-ink-faint last:border-b-0
   - Number: font-mono text-xs text-ink-dim min-w-[32px] pt-1
     (format: "01", "02", etc. — String(i+1).padStart(2,'0'))
   - Content: flex-1
     - Name: font-heading text-xl font-semibold text-ink mb-1
     - Description: text-sm text-ink-dim mt-1
   - Tech: font-mono text-[13px] text-ink-dim text-right min-w-[260px] pt-1
     (on mobile: text-left, below name, min-w-0)

DATA:
- import { SOVEREIGN_STACK } from '@/lib/data/curated'
- Map over SOVEREIGN_STACK array

ANIMATIONS (gsap.context, all with once: true):
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Heading group
      gsap.from(headerRef.current, {
        x: -50, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
      });

      // Layer rows — staggered
      gsap.from(layerRefs, {
        x: -30, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: layersRef.current, start: 'top 75%', once: true }
      });

      // Divider lines — draw in
      gsap.from(dividerRefs, {
        scaleX: 0, transformOrigin: 'left center', stagger: 0.12, duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: layersRef.current, start: 'top 75%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

REFS: Use useRef for sectionRef, headerRef, layersRef.
Use gsap.utils.toArray or individual refs for layer rows and dividers.

BACKGROUND:
- CSS dot-matrix pattern via the .bg-dotmatrix utility class from globals.css
- Applied as a pseudo-element or a div with absolute positioning, full section size

RESPONSIVE:
- Desktop (lg+): flex-row layout for each layer (number | content | tech)
- Mobile (<lg): flex-col, tech tags below name, min-w-0 on tech

Write the complete component. Full TypeScript.
```

---

## Implementation Task 5: Projects Section

```
Rebuild the Projects section with Web3 glass cards.

FILES:
- components/sections/Projects.tsx
- components/ui/ProjectCard.tsx
- components/ui/FilterTabs.tsx

--- ProjectCard.tsx ---

Props interface (MUST match existing data model):
  export interface ProjectCardProps {
    name: string;
    description: string;
    layer: 'foundation' | 'interface' | 'intelligence' | 'visualization' | 'tools' | 'other';
    topics: string[];
    language?: string;
    languageColor?: string;
    repoUrl?: string;
    featured?: boolean;
  }

Card structure:
- Outer div: glass card styles from globals.css (.glass-card class)
  border: 1px solid glass-stroke, bg: glass-fill, backdrop-blur-[12px],
  rounded-lg (0.5rem), p-6, flex flex-col gap-3
  transition: border-color 0.3s, transform 0.3s
  hover: border rgba(232,228,222,0.15), translateY(-2px)
  The rotating border glow animation from globals.css activates on hover
- Header row: flex justify-between items-start
  - Name: font-heading text-xl font-semibold text-ink
  - Badge (if featured): font-mono text-[10px] text-accent border border-accent/30
    px-2 py-0.5 rounded uppercase tracking-wide
- Description: text-sm text-ink-dim line-clamp-3
- Topics: font-mono text-[13px] text-ink-faint (joined with " · ")
- Footer: flex justify-between items-center mt-auto pt-2
  - Language: flex items-center gap-1.5 font-mono text-[13px] text-ink-dim
    with colored dot (8px circle)
  - Link: "GitHub →" font-mono text-[13px] text-ink-dim, link opens in new tab
    with rel="noopener noreferrer"

--- FilterTabs.tsx ---

Props interface:
  export interface FilterTabsProps {
    categories: readonly string[];
    active: string;
    onChange: (category: string) => void;
  }

Structure:
- Horizontal flex with gap-6, overflow-x-auto on mobile, scrollbar-none
- Each tab: <button> with font-mono text-xs tracking-[0.12em] uppercase
  - Active: text-ink + border-b-2 border-ink pb-1.5
  - Inactive: text-ink-dim pb-1.5 hover:text-ink transition-colors
- Categories: ["ALL", "FOUNDATION", "INTERFACE", "INTELLIGENCE", "VISUALIZATION", "TOOLS"]

--- Projects.tsx ---

Props: none (data is imported directly)

Data flow:
  import { curatedProjectOverrides, curatedFlagshipOrder, languageColors }
    from '@/lib/data/curated';
  import { useGitHubPortfolioData } from '@/lib/hooks/useGitHubPortfolioData';
  // DO NOT use /api routes. This is a static export site.

State: activeFilter (string, default "ALL")

Filtering logic:
- "ALL" shows all projects
- Other filters match project.layer
- Sort: curatedFlagshipOrder determines order (OMNI first)

Layout:
- <section id="projects">
- Overline: "// DEPLOYMENTS"
- Heading: "WORK"
- <FilterTabs /> below heading
- Grid: grid grid-cols-1 lg:grid-cols-2 gap-6
- Map filtered projects to <ProjectCard />

ANIMATIONS (gsap.context, once: true):
- Heading: fade in on scroll entry
- Filter tabs: stagger fade in, 0.05s each
- Cards: stagger fadeIn + slideUp on scroll entry
  gsap.from(cardRefs, {
    y: 50, opacity: 0, rotateX: 2, stagger: { each: 0.08, grid: 'auto', from: 'start' },
    duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: gridRef, start: 'top 85%', once: true }
  });
- Filter change: NO GSAP. Use simple CSS transition (opacity 0→1 on cards,
  0.3s ease). Keep it simple.

Write all three complete files.
```

---

## Implementation Task 6: About Section

```
Create the About / Identity section.

File: components/sections/About.tsx

LAYOUT:
- <section id="about">
- Container: max-w-[1200px] mx-auto px-4 lg:px-16
- Two-column: grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20
- Section padding: py-[clamp(80px,7.6vw+50px,160px)]

LEFT COLUMN:
1. Overline: "// IDENTITY"
2. Heading: "ABOUT"
3. Bio: import profile.bio from lib/data/profile.ts
   (font-body, text-base, text-ink, leading-relaxed, mb-8)
4. Capabilities:
   - Sub-overline: "CAPABILITIES"
   - import { capabilities } from '@/lib/data/profile'
   - Map: each domain = { domain name (text-sm font-medium text-ink mb-1),
     skills (font-mono text-[13px] text-ink-dim, joined with " · ", mb-4) }
5. Meta: "Dubai, UAE" and "BSc (Hons) IT — Middlesex University Dubai"
   (font-mono text-[13px] text-ink-dim leading-relaxed)

RIGHT COLUMN:
1. GitHub stats (grid grid-cols-2 gap-6 mb-10):
   - USE the existing hook: import { useGitHubPortfolioData }
     from '@/lib/hooks/useGitHubPortfolioData'
   - const { data } = useGitHubPortfolioData();
   - 4 stat items: Repos, Contributions, Stars, Since
   - Label: font-mono text-xs tracking-wide uppercase text-ink-dim mb-1
   - Value: font-heading text-xl font-semibold text-ink
   - Fallback to profile.stats if data is null

2. Language chart (below stats):
   - Sub-overline: "LANGUAGES"
   - import { languageDistribution } from '@/lib/data/profile'
   - Horizontal bars:
     Each row: flex items-center gap-3 mb-2.5
     - Label: font-mono text-[13px] text-ink-dim min-w-[100px] text-right
     - Bar: h-1.5 rounded-full, width = (pct / maxPct * 100)%,
       background = language color, opacity 0.7
     - Pct: font-mono text-[13px] text-ink-faint min-w-[36px]

ANIMATIONS (gsap.context, once: true):
  // Left column: slide from left
  gsap.from(leftRef, { x: -40, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: sectionRef, start: 'top 75%', once: true } });
  // Right column: slide from right
  gsap.from(rightRef, { x: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: sectionRef, start: 'top 75%', once: true } });
  // Language bars: fill width
  gsap.from(barRefs, { scaleX: 0, transformOrigin: 'left', stagger: 0.1,
    duration: 1.0, ease: 'power4.out',
    scrollTrigger: { trigger: chartRef, start: 'top 80%', once: true } });
  // Stats: count up using GSAP snap (NO CountUp.js dependency)
  statRefs.forEach((ref, i) => {
    gsap.from(ref, { textContent: 0, duration: 1.5, delay: i * 0.2,
      snap: { textContent: 1 }, ease: 'power2.out',
      scrollTrigger: { trigger: statsRef, start: 'top 80%', once: true } });
  });

Write the complete component.
```

---

## Implementation Task 7: Contact Section

```
Rebuild the Contact / Footer section.

File: components/sections/Contact.tsx

LAYOUT:
- <footer id="contact" role="contentinfo">
- min-h-[50vh], flex flex-col items-center justify-center text-center
- Padding: pt-[120px] pb-[60px]

CONTENT:
1. Overline: "// UPLINK"
2. Heading: "LET'S BUILD" (font-heading text-3xl font-semibold text-ink mb-6)
3. Email: <a href="mailto:m.afsah.279@gmail.com"> with class link-hover
   (font-body text-base text-accent inline-block mb-4)
   aria-label="Send email to Muhammad Afsah Mumtaz"
4. Socials: "GitHub · LinkedIn · Twitter"
   (font-mono text-[13px] text-ink-dim mb-12)
   Each word is a link. Separated by " · ". Hover: text-ink.
   All: target="_blank" rel="noopener noreferrer"
5. Horizontal rule: w-[200px] h-px bg-ink-faint mx-auto mb-6
6. Copyright: "© 2026 Muhammad Afsah Mumtaz"
   (font-mono text-[13px] text-ink-faint)

DATA:
- import { profileIdentity } from '@/lib/data/curated'
- Use profileIdentity.email, profileIdentity.socials

ANIMATIONS (gsap.context, once: true):
  // Heading: fade + SLIGHT scale (NOT back.out — use power3.out)
  gsap.from(headingRef, { scale: 0.97, opacity: 0, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: sectionRef, start: 'top 80%', once: true } });
  // Email + socials: stagger fade
  gsap.from([emailRef, socialsRef], { y: 20, opacity: 0, stagger: 0.15,
    duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: sectionRef, start: 'top 80%', once: true } });

NO bouncy easing anywhere. Use power2.out or power3.out only.

BACKGROUND:
- Optional: if the faded ASCII hands image exists at public/assets/contact-hands-faded.png,
  add it as a CSS background-image with opacity: 0.06, bg-center, bg-no-repeat, bg-cover.
  If the file doesn't exist, skip it — the void is fine on its own.
- The WaveSurface in SceneContainer handles the WebGL background when
  activeSection === 'contact'

Write the complete component.
```

---

## Implementation Task 8: Scroll Orchestration, Navigation, useScrollSpy

```
Build the scroll orchestration system, navigation, and the useScrollSpy hook.

FILES:
- lib/hooks/useScrollSpy.ts (NEW — custom hook)
- components/motion/SectionOrchestrator.tsx
- components/ui/Navigation.tsx

--- useScrollSpy.ts ---

Custom hook that tracks which section is currently in view.
Uses GSAP ScrollTrigger (NOT IntersectionObserver — stay consistent with GSAP).

  export function useScrollSpy(sectionIds: string[]): string {
    const [active, setActive] = useState(sectionIds[0]);
    useEffect(() => {
      const triggers = sectionIds.map(id => {
        const el = document.getElementById(id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(id),
          onEnterBack: () => setActive(id),
        });
      });
      return () => triggers.forEach(t => t?.kill());
    }, [sectionIds]);
    return active;
  }

--- SectionOrchestrator.tsx ---

Responsibilities:
1. Thin progress bar at viewport top (2px, off-white fill on transparent track)
2. Tracks total scroll progress (0→1)
3. Dispatches custom events for other components to consume

Structure:
- Fixed div, top-0, left-0, w-full, h-[2px], z-50
- Inner div: h-full bg-ink, transform scaleX(0), transform-origin left

GSAP:
  gsap.to(barRef, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom',
      scrub: 0.3 }
  });

Also: dispatches 'portfolio-scroll-progress' CustomEvent with detail: { progress }
and 'portfolio-section-active' with detail: { section } when active section changes.

--- Navigation.tsx ---

Fixed navigation bar. Invisible until user scrolls past hero.

DESKTOP (lg+):
- fixed top-0 w-full z-40
- Initially: opacity-0, pointer-events-none
- After 100vh scroll: opacity-1, pointer-events-auto
  backdrop-blur-[12px] bg-void/80 border-b border-ink-faint
- Left: "NAME0x0" (font-heading font-bold text-sm text-ink)
- Right: nav links ["Stack", "Work", "About", "Contact"]
  (font-mono text-xs tracking-[0.12em] uppercase)
  Active: text-ink + 2px underline (bottom border)
  Inactive: text-ink-dim hover:text-ink transition-colors
- Active section detected via useScrollSpy(['hero','stack','projects','about','contact'])
- Click: smooth scroll using gsap.to(window, { scrollTo: '#section-id', duration: 1,
  ease: 'power2.inOut' })
  IMPORTANT: Register ScrollToPlugin: gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

MOBILE (<lg):
- Show hamburger button: fixed top-4 right-4 z-50
  3 horizontal lines (2px height, 24px wide, bg-ink, space-y-[5px])
  aria-label="Open navigation menu"
- Hamburger opens full-screen overlay:
  fixed inset-0 z-[60] bg-void
  Section links centered: font-heading text-display font-bold text-ink
  Stagger animation using useRef (NOT class selectors):
    gsap.fromTo(linkRefs, { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' });
  Close button: absolute top-4 right-4, X icon, aria-label="Close menu"
  KEYBOARD: Escape key closes overlay
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [isOpen]);
  Click link: close overlay → gsap scrollTo

Show/hide logic (GSAP, NOT CSS transition):
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: '100vh top',
        onEnter: () => gsap.to(navRef.current, { opacity: 1, duration: 0.3,
          onStart: () => { navRef.current!.style.pointerEvents = 'auto'; } }),
        onLeaveBack: () => gsap.to(navRef.current, { opacity: 0, duration: 0.3,
          onComplete: () => { navRef.current!.style.pointerEvents = 'none'; } })
      });
    });
    return () => ctx.revert();
  }, []);

ACCESSIBILITY:
- <nav aria-label="Main navigation">
- All links are <a href="#section-id"> for native fallback
- Focus visible styles: outline-2 outline-offset-2 outline-ink
- Skip-to-content link before nav (visually hidden, visible on focus):
  <a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>

Write all three complete files. Import ScrollToPlugin from 'gsap/ScrollToPlugin'.
```

---

## Implementation Task 9: Page Composition + Layout

```
Rewrite the main page and layout to compose everything.

FILE 1: app/page.tsx

"use client";

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback } from 'react';
import Navigation from '@/components/ui/Navigation';
import SectionOrchestrator from '@/components/motion/SectionOrchestrator';

// Dynamic imports for WebGL-heavy components (ssr: false)
const SceneContainer = dynamic(
  () => import('@/components/three/SceneContainer'), { ssr: false }
);

// Sections can be statically imported (they're just HTML + GSAP)
// but dynamic import them too for code-splitting
const Hero = dynamic(() => import('@/components/sections/Hero'));
const SovereignStack = dynamic(() => import('@/components/sections/SovereignStack'));
const Projects = dynamic(() => import('@/components/sections/Projects'));
const About = dynamic(() => import('@/components/sections/About'));
const Contact = dynamic(() => import('@/components/sections/Contact'));

export default function Page() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState<[number, number]>([0, 0]);

  // Mouse tracking for WebGL
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos([
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    ]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    // Listen for orchestrator events
    const onProgress = (e: Event) =>
      setScrollProgress((e as CustomEvent).detail.progress);
    const onSection = (e: Event) =>
      setActiveSection((e as CustomEvent).detail.section);
    window.addEventListener('portfolio-scroll-progress', onProgress);
    window.addEventListener('portfolio-section-active', onSection);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('portfolio-scroll-progress', onProgress);
      window.removeEventListener('portfolio-section-active', onSection);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Fixed WebGL canvas behind everything */}
      <Suspense fallback={null}>
        <SceneContainer
          scrollProgress={scrollProgress}
          activeSection={activeSection}
          mousePosition={mousePos}
        />
      </Suspense>

      {/* Navigation + Progress bar */}
      <Navigation />
      <SectionOrchestrator />

      {/* Main content (z-index above canvas) */}
      <main id="main" role="main" aria-label="Muhammad Afsah Mumtaz portfolio"
            className="relative z-10">
        <Suspense fallback={null}><Hero /></Suspense>
        <Suspense fallback={null}><SovereignStack /></Suspense>
        <Suspense fallback={null}><Projects /></Suspense>
        <Suspense fallback={null}><About /></Suspense>
        <Suspense fallback={null}><Contact /></Suspense>
      </main>
    </>
  );
}

FILE 2: app/layout.tsx

Update the root layout:
- Import Space Grotesk from next/font/google (weight: [400, 600, 700])
- Import Manrope from next/font/google (weight: [400, 500])
- Import Geist Mono — already in the project via the 'geist' package:
  import { GeistMono } from 'geist/font/mono'
- Apply font CSS variables to <html>:
  className={`${spaceGrotesk.variable} ${manrope.variable} ${geistMono.variable}`}
- Body: className="bg-void text-ink font-body antialiased"
- Metadata:
  title: "Muhammad Afsah Mumtaz — Systems Architect"
  description: "I design sovereign computing systems across operating environments,
  AI workflows, and immersive interfaces."
  Open Graph: title, description, url: "https://name0x0.github.io"
- StructuredData component (already exists, keep it)

FILE 3: components/StructuredData.tsx
Update the structured data to reflect the new design. Keep existing structure,
just update any outdated fields.

Write all files. This is the final assembly — ensure all section IDs match
nav links: hero, stack, projects, about, contact.
```

---

## How to Use These Prompts

### On the Codex CLI:

```bash
cd /path/to/NAME0x0.github.io
codex --model gpt-5.3-codex --reasoning xhigh
```

Paste the **Pre-Prompt Context** first, then each task sequentially.

### Execution Order (strict):

1. **Design tokens + globals + tailwind** (foundation)
2. **WebGL scene + shaders** (visual backbone)
3. **Hero section** (first visible thing)
4. **Sovereign Stack** (section 2)
5. **Projects** (section 3)
6. **About** (section 4)
7. **Contact** (section 5)
8. **Scroll orchestration + Navigation** (ties everything together)
9. **Page composition + Layout** (final assembly)

### After EACH Task — Bring to Claude:

```
Review the Codex output for Task [N]: [name]. Check against the portfolio
review checklist in orchestration/06-CLAUDE-REVIEW-CHECKLIST.md.
```

### Key Fixes Pre-Applied (from Claude's review of Gemini output):

- [P0] No /api routes — uses existing SWR hook + snapshot fallback
- [P0] Tailwind breakpoints EXTEND defaults, don't replace
- [P0] AsciiHands uses texture sampling shader (not generic particle field)
- [P1] No snoise dependency — uses sin/cos drift for VoidParticles
- [P1] WaveSurface uses Three.js wireframe mode, not custom fragment shader
- [P1] No bouncy easing (back.out removed) — power2/power3 only
- [P1] Every section uses gsap.context() with cleanup
- [P1] All entry animations have once: true
- [P1] useScrollSpy hook fully implemented
- [P2] Card borderRadius: 0.5rem (not 1rem)
- [P2] Glass blur: 12px (not 24px)
- [P2] gl_PointSize uses uResolution uniform (no magic numbers)
- [P2] Mobile nav uses refs (not class selectors) for GSAP
- [P2] Escape key closes mobile nav
- [P2] ProjectCard props match actual data model (layer/topics, not category)
- [P3] Loading: simple fade (no pulse bounce)
- [P3] Multi-frequency wave surface for visual interest
