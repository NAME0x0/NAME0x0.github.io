# Phase 3 — Gemini 3.1 Pro Frontend Design Prompts

These prompts are for **Gemini 3.1 Pro on Google Antigravity IDE**. Each prompt is a self-contained task. Run them sequentially — each builds on the previous output.

---

## Pre-Prompt Context (paste once at session start)

```
PORTFOLIO REDESIGN CONTEXT

You are redesigning a personal portfolio website for Muhammad Afsah Mumtaz
(GitHub: NAME0x0), a Systems Architect / AI Engineer / OS Developer based
in Dubai.

EXISTING TECH STACK (keep these):
- Next.js 14 (static export for GitHub Pages)
- React 18 with TypeScript
- Three.js / React Three Fiber / Drei
- GSAP + ScrollTrigger
- TailwindCSS 3
- SWR for data fetching

DESIGN DIRECTION:
- Pure black (#000000) background — the "void"
- Off-white (#E8E4DE) as primary text/UI color
- Web3 glass-morphism aesthetic
- ASCII dot-matrix stipple rendering style for hero visual
- Monospace + refined sans-serif typography
- Procedural WebGL shaders for all backgrounds (no static images)
- Minimal, authoritative, sovereign

COLOR TOKENS:
- void: #000000 (background)
- ink: #E8E4DE (primary text, borders)
- ink-dim: #8A8578 (secondary text)
- ink-faint: #3A3832 (dividers, subtle borders)
- accent: #C4B5A0 (hover states, active elements)
- glass-stroke: rgba(232, 228, 222, 0.08) (card borders)
- glass-fill: rgba(232, 228, 222, 0.03) (card backgrounds)

TYPOGRAPHY:
- Display/Heading: Space Grotesk
- Body: Manrope
- Mono/Code: Geist Mono

SECTIONS (with terminal-style overline labels):
1. // INIT — Hero: ASCII Creation of Adam hands, name, role. NO tagline.
2. // ARCHITECTURE — Sovereign Stack: 5 tech layers (Foundation → Tools)
3. // DEPLOYMENTS — Projects: Filterable 2-col grid, 9 featured projects (OMNI first)
4. // IDENTITY — About: Bio, capabilities, GitHub stats, language chart
5. // UPLINK — Contact: Email, socials, faded hands callback

FLAGSHIP ORDER: OMNI > SMNTC > AVA > MALD > MAVIS > Terminus > Tangled > WebDesk > QuickTask
OMNI: Sparse MoE 1.05T param LLM for 4GB VRAM (Rust, layer streaming, ternary inference)

FILE STRUCTURE (current):
app/page.tsx — main composition
components/sections/ — section components
components/three/ — WebGL components
components/motion/ — scroll orchestration
lib/design-system/tokens.ts — design tokens
lib/data/ — project and profile data
```

---

## Prompt 1: Component Architecture

```
Based on the context above, design the complete component architecture
for this portfolio. I need:

1. COMPONENT TREE
   Show the full component hierarchy as a tree diagram. Include:
   - Page layout components
   - Section components (Hero, Stack, Projects, About, Contact)
   - Three.js/WebGL components (what renders in each Canvas)
   - Shared UI components (cards, buttons, nav, tabs)
   - Motion/orchestration components

2. FILE STRUCTURE
   Map every component to a file path following the existing structure:
   - components/sections/*.tsx
   - components/three/*.tsx
   - components/motion/*.tsx
   - components/ui/*.tsx (new, for shared primitives)

3. PROPS INTERFACE
   For each component, define the TypeScript props interface with:
   - Required vs optional props
   - Types for complex props (like project data)
   - Ref forwarding needs for GSAP

4. DATA FLOW
   How does data flow from lib/data/* and lib/github/* into components?
   Which components need SWR hooks? Which use static data?

5. RENDER STRATEGY
   Which components need dynamic(() => import(...), { ssr: false })?
   Which can render on the server?

Output as a structured technical document with code snippets for
the interfaces. This will be handed to the implementation team.
```

---

## Prompt 2: GLSL Shader Specifications

```
I need GLSL shader specifications for 4 WebGL effects in this portfolio.
Each shader should use the off-white (#E8E4DE) on black (#000000) palette.

SHADER 1: ASCII DOT-MATRIX FIELD
- Purpose: Background for Hero and sparse use in other sections
- Effect: A field of small circular dots arranged in a grid
- Dots should drift slowly (organic, not linear)
- Dot brightness varies with a Perlin noise function
- Some dots "breathe" (scale up/down slowly)
- Dots near the cursor should react (brighten, move away slightly)
- Color: off-white dots on black, varying opacity 0.05 to 0.4
- Write the vertex and fragment shader GLSL code
- Include uniform definitions for: time, mouse position, scroll progress

SHADER 2: VOID PARTICLE DRIFT
- Purpose: Ambient atmosphere throughout the page
- Effect: Sparse particles drifting slowly through the void
- Particles are tiny circles (2-4px), off-white, very low opacity (0.03-0.15)
- Movement: organic, curl-noise-based drift, never linear
- Density: sparse — max 200 particles on screen at once
- Depth: some particles are "closer" (larger, brighter) vs "farther"
- Should respond to scroll (parallax at different rates per depth layer)
- Write as a shader material for Three.js Points geometry

SHADER 3: WAVE SURFACE
- Purpose: Contact section background
- Effect: A flat plane with gentle wave displacement
- Render as wireframe lines (not solid surface)
- Lines in off-white, very low opacity (0.08-0.2)
- Wave frequency: low (2-3 waves across the viewport)
- Wave amplitude: subtle (5-15px displacement)
- Movement: continuous slow drift, never stops
- Should look like a calm digital ocean

SHADER 4: GLASS CARD BORDER GLOW
- Purpose: Hover effect on project cards
- Effect: A animated border gradient that travels around the card edge
- Color: off-white to transparent, with a slight warm tint
- Speed: completes one loop in ~4 seconds
- Should be implementable as a CSS + SVG effect (not WebGL) for performance
- Fallback: simple border-color transition for reduced motion

For each shader, provide:
- Complete GLSL vertex shader code
- Complete GLSL fragment shader code
- Uniform definitions with types
- JavaScript/TypeScript integration notes for React Three Fiber
- Performance considerations (target: 60fps on mid-range GPU)
```

---

## Prompt 3: Scroll Orchestration Timeline

```
Design the complete GSAP ScrollTrigger timeline for this portfolio.
The page has 5 sections: Hero, Stack, Projects, About, Contact.

I need:

1. MASTER TIMELINE
   Define the scroll ranges (as % of total scroll height) for each section.
   When does each section's animation start and end?

2. HERO ANIMATIONS
   - ASCII hands: animate from off-screen (left + right) to center, almost
     touching. Duration: first 20% of hero scroll range.
   - Name text: fade in + slide up after hands reach position.
     Delay: 0.3s after hands. Duration: 0.5s.
   - Role text: fade in after name. Delay: 0.2s. Duration: 0.3s.
   - On scroll past hero: hands slowly drift apart (parallax, 0.1x speed).
   - Particle field: continuous, not scroll-linked.

3. STACK ANIMATIONS
   - Section heading: fade in + slide from left on scroll entry.
   - Each layer row: staggered slide-in from left.
     Stagger: 0.1s between layers.
   - Layer numbers: count up (01, 02, 03...) as each enters.
   - Horizontal dividers: draw from left to right as each layer enters.

4. PROJECTS ANIMATIONS
   - Section heading: fade in on scroll entry.
   - Filter tabs: fade in after heading, stagger 0.05s each.
   - Project cards: stagger fade-in + slide-up by row.
     Row stagger: 0.15s. Column stagger: 0.08s.
   - Cards should have a slight 3D tilt on entry (rotateX: 2deg → 0deg).

5. ABOUT ANIMATIONS
   - Left column: slide in from left.
   - Right column: slide in from right.
   - Language bars: animate width from 0% to target%.
     Stagger: 0.1s between bars.
   - Stats numbers: count up from 0 to target value.
     Duration: 1.5s each, staggered 0.2s.

6. CONTACT ANIMATIONS
   - Heading: fade in + scale from 0.95 to 1.
   - Email: fade in after heading.
   - Social links: stagger fade in after email.
   - Background hands: continuous slow drift (not scroll-linked).

7. GLOBAL ELEMENTS
   - Progress bar: scrub with total scroll (0% to 100%).
   - Navigation: appears after scrolling 100vh (opacity 0 → 1).
   - Active nav item: updates based on which section is in view.

For each animation, specify:
- GSAP method (gsap.to, gsap.from, gsap.fromTo, ScrollTrigger)
- Properties animated (opacity, x, y, scale, rotateX, etc.)
- Easing function
- Duration or scrub value
- Start/end trigger points
- Mobile adjustments (simplified for performance)

Output as a structured timeline document with pseudocode that can be
directly translated into GSAP + ScrollTrigger calls.
```

---

## Prompt 4: Responsive Design System

```
Define the complete responsive design system for this portfolio.

1. BREAKPOINTS
   Define breakpoints and what changes at each:
   - Desktop XL: 1440px+
   - Desktop: 1024-1439px
   - Tablet: 768-1023px
   - Mobile: 390-767px
   - Mobile Small: <390px

2. GRID SYSTEM
   - Desktop: 12-column grid, 24px gutters, max-width 1200px
   - Tablet: 8-column grid, 20px gutters
   - Mobile: 4-column grid, 16px gutters
   - Define container padding at each breakpoint

3. TYPOGRAPHY SCALE
   For each text style (Display, H1, H2, Overline, Body, Body Small, Code),
   define the font-size, line-height, and letter-spacing at each breakpoint.
   Use fluid typography (clamp()) where appropriate.

4. SPACING SCALE
   Define a spacing scale that adapts to viewport:
   - Section vertical padding
   - Component gaps
   - Card internal padding
   - Use CSS clamp() for fluid spacing

5. COMPONENT ADAPTATIONS
   For each major component, describe what changes at each breakpoint:
   - Hero: hands size, text size, vertical spacing
   - Stack: row layout adjustments
   - Projects: grid columns (2 → 1), card sizing
   - About: 2-col → 1-col, stats grid
   - Contact: spacing adjustments
   - Navigation: desktop text → mobile hamburger
   - Filter tabs: horizontal → horizontal scroll

6. THREE.JS PERFORMANCE TIERS
   - Desktop: full quality (DPR 2, full particle count, all shaders)
   - Tablet: reduced (DPR 1.5, 60% particles, simplified shaders)
   - Mobile: minimal (DPR 1, 30% particles, CSS fallbacks where possible)
   - Reduced motion: static gradients, no particles, no parallax

Output as Tailwind CSS classes and custom CSS where needed.
Include the clamp() calculations for fluid values.
```

---

## Prompt 5: Design Token System

```
Rewrite the design token system (lib/design-system/tokens.ts) for
the new black + off-white aesthetic. The current file has these exports:
colors, typography, spacing, borderRadius, shadows, animations, components.

I need the complete updated tokens.ts file with:

1. COLORS
   - Remove all current blue/cyan/green colors
   - New palette: void, ink, ink-dim, ink-faint, accent
   - Semantic colors: only error (muted red) and info (muted blue)
   - Glass morphism tokens: glass-stroke, glass-fill, glass-blur

2. TYPOGRAPHY
   - Keep Space Grotesk, Manrope, Geist Mono
   - Define size scale from xs to display
   - Include line-height and letter-spacing per size
   - Define responsive variants using clamp()

3. SPACING
   - Define scale from 2xs to 6xl
   - Use rem values
   - Add section-specific spacing tokens

4. SHADOWS
   - Remove all current neon/holo shadows
   - New: glass (very subtle), glow (warm off-white glow for hover)
   - Keep them minimal — this is a void-based design

5. ANIMATIONS
   - Keep existing keyframes that are useful
   - Add: dot-breathe, hand-reach, count-up, bar-fill
   - Define easing curves: smooth (existing), entrance, exit

6. COMPONENT PRESETS
   - Card: glass style (border + fill + backdrop-blur)
   - Button: text-only (no fills), hover underline
   - Input: if needed, same glass style
   - Nav: transparent, fixed
   - Tab: text-only, active underline

Write the complete TypeScript file. It should be drop-in replaceable
with the existing tokens.ts.
```

---

## Prompt 6: Navigation & Interaction Design

```
Design the navigation and micro-interaction system for this portfolio.

1. FIXED NAVIGATION
   - Desktop: horizontal bar at top, transparent bg
   - Shows: "NAME0x0" left, section links right
   - Hidden until user scrolls past hero (100vh)
   - On appear: fade in with backdrop-blur
   - Active section: text color changes to ink (from ink-dim)
   - Active indicator: thin underline (2px, off-white), animated slide

2. MOBILE NAVIGATION
   - Hamburger icon (custom: 3 thin lines, off-white)
   - Opens: full-screen black overlay with section links centered
   - Section links: Display size, stagger fade in on open
   - Close: X icon in same position as hamburger
   - Transition: overlay scales from hamburger position

3. SCROLL CUE (Hero)
   - A thin animated line or arrow at bottom of hero
   - Pulses gently to indicate scrollability
   - Disappears after first scroll interaction

4. CURSOR EFFECTS (Desktop only)
   - Default: no custom cursor
   - On links/buttons: subtle scale-up of native cursor (or dot cursor)
   - On Three.js canvases: WebGL elements react to cursor position
   - Keep it subtle — no distracting trail effects

5. HOVER STATES
   - Text links: underline slides in from left on hover
   - Project cards: border glow animation (see shader spec)
   - Social links: color transition ink-dim → ink
   - Filter tabs: active underline slides to hovered tab

6. LOADING STATE
   - Initial: black screen, name fades in at center, then page loads
   - Keep it under 1 second on fast connections
   - Three.js components: Suspense fallback is just the black void
   - No skeleton screens — let content fade in when ready

7. REDUCED MOTION
   - Detect prefers-reduced-motion
   - Disable: all scroll animations, particle effects, parallax, hand animation
   - Keep: instant state changes, color transitions (fast)
   - Replace Three.js canvases with: static CSS gradient (very subtle radial)

Provide implementation details for each, including:
- React component structure
- CSS/Tailwind classes
- GSAP calls where relevant
- Accessibility considerations (focus states, keyboard nav, screen readers)
```

---

## How to Use These Prompts

1. Open **Google Antigravity IDE** with the portfolio project
2. Start a new Gemini 3.1 Pro session
3. Paste the **Pre-Prompt Context** first
4. Run **Prompt 1** through **Prompt 6** sequentially
5. After each response, review and save the output
6. Bring the outputs back to Claude for review before implementation
7. Then hand the approved designs to **Codex** for implementation

### Recommended Antigravity Settings
- Model: Gemini 3.1 Pro
- Context: Attach the full `lib/` and `components/` directories
- Mode: Agent mode (allow file reads for understanding existing code)
