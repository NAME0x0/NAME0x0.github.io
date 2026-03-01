# Phase 5 — Claude Review Checklist

This is the checklist I (Claude, Opus 4.6) use to review all code coming back from Gemini and Codex before it ships. Every PR must pass all applicable checks.

---

## How to Trigger a Review

Paste the code or file path and say:

```
Review this code against the portfolio redesign checklist.
```

Or for a full project review:

```
Run the full review checklist against the current codebase.
```

---

## 1. TypeScript Correctness

- [ ] No `any` types anywhere
- [ ] All component props have explicit interfaces (not inline types)
- [ ] Props interfaces are exported for reuse
- [ ] Ref forwarding uses `React.forwardRef` with proper generic types
- [ ] Event handlers are properly typed (not `(e: any) => void`)
- [ ] Three.js types from `@types/three` used correctly
- [ ] GSAP timeline types used (`gsap.core.Timeline`)
- [ ] No type assertions (`as`) unless absolutely necessary and commented
- [ ] Strict null checks pass (`strictNullChecks: true`)
- [ ] No unused variables or imports

## 2. React Best Practices

- [ ] Components use function declarations (not arrow functions for top-level)
- [ ] `useCallback` for event handlers passed to children
- [ ] `useMemo` for expensive computations and object/array creation
- [ ] `useRef` for GSAP targets and timelines (not state)
- [ ] Cleanup in `useEffect` returns (especially GSAP timelines and ScrollTriggers)
- [ ] No state updates on unmounted components
- [ ] Keys on mapped elements are stable and unique (not index)
- [ ] Dynamic imports with `ssr: false` for Three.js components
- [ ] Suspense boundaries with appropriate fallbacks
- [ ] No prop drilling beyond 2 levels (use context or composition)

## 3. Three.js / R3F Performance

- [ ] `useFrame` callbacks don't create objects (pre-allocate with useRef)
- [ ] Geometries and materials created outside render loop
- [ ] `dispose()` called on unmount for custom geometries/materials/textures
- [ ] Buffer attributes use `Float32Array` (not regular arrays)
- [ ] DPR capped: `Math.min(window.devicePixelRatio, 2)`
- [ ] Canvas settings: `antialias: false` on mobile, `stencil: false`
- [ ] Shader uniforms updated via `.needsUpdate` flag (not re-creation)
- [ ] No `new THREE.*` inside useFrame
- [ ] Texture loading via `useLoader` or `useTexture` (not raw TextureLoader)
- [ ] Mobile: reduced particle counts, lower segment counts

## 4. GSAP / Animation

- [ ] ScrollTrigger instances killed on unmount (`scrollTrigger.kill()`)
- [ ] Timelines killed on unmount (`timeline.kill()`)
- [ ] `gsap.context()` used for scoped cleanup
- [ ] No conflicting animations on the same element
- [ ] `will-change` CSS applied (but not too broadly)
- [ ] Animations target `transform` and `opacity` only (GPU-accelerated)
- [ ] No layout-triggering properties animated (width, height, top, left)
- [ ] `prefers-reduced-motion` respected (via `gsap.matchMedia` or manual check)
- [ ] Reasonable durations (0.2s-1.5s, nothing feels sluggish)
- [ ] Easing is intentional (not default `power1`)

## 5. Accessibility (WCAG 2.1 AA)

- [ ] Semantic HTML elements (`section`, `nav`, `footer`, `h1`-`h6`, `main`)
- [ ] Heading hierarchy is correct (h1 > h2 > h3, no skips)
- [ ] All interactive elements are keyboard-focusable (Tab order)
- [ ] Focus styles visible (outline or custom ring)
- [ ] Color contrast ratio >= 4.5:1 for text (check off-white on black: ~15:1, good)
- [ ] Color contrast ratio >= 3:1 for ink-dim text on black (check: #8A8578 on #000)
- [ ] `aria-label` on sections, nav, and non-text elements
- [ ] Canvas elements have `role="img"` and `aria-label`
- [ ] Links have descriptive text (not "click here")
- [ ] External links have `rel="noopener noreferrer"` and open in new tab
- [ ] Skip-to-content link for keyboard users
- [ ] Reduced motion: all animations disabled, content still accessible
- [ ] Screen reader: all content readable in logical order

## 6. Performance

- [ ] Lighthouse Performance score >= 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Bundle size: each dynamic chunk < 100KB gzipped
- [ ] Images: AVIF with PNG fallback, properly sized
- [ ] Videos: WebM with MP4 fallback, < 2MB per loop
- [ ] Fonts: preloaded, subset to used characters
- [ ] No render-blocking resources in critical path
- [ ] Three.js canvas: 60fps on mid-range GPU
- [ ] Mobile: reduced WebGL complexity (check isMobile patterns)

## 7. Visual Fidelity

- [ ] Background is pure black (#000000, not off-black)
- [ ] Text color matches tokens (#E8E4DE, not white)
- [ ] Secondary text matches ink-dim (#8A8578)
- [ ] Glass card borders barely visible (8% opacity)
- [ ] No unexpected color bleeding from Three.js canvases
- [ ] Typography matches spec (fonts, sizes, weights, tracking)
- [ ] Spacing matches wireframe proportions
- [ ] ASCII hands render cleanly at all viewport sizes
- [ ] No visible seams between sections
- [ ] Scroll is smooth, no jank during animations

## 8. Responsive Design

- [ ] Desktop (1440px): 2-column grids, full layouts
- [ ] Desktop (1024px): Graceful scaling, no breakage
- [ ] Tablet (768px): Layout adaptations kick in
- [ ] Mobile (390px): Single column, touch-friendly targets (44px min)
- [ ] Mobile Small (<390px): No horizontal overflow
- [ ] Navigation: desktop text links → mobile hamburger
- [ ] Filter tabs: horizontal scroll on mobile (no wrap)
- [ ] Three.js: DPR and complexity reduce on mobile
- [ ] No horizontal scrollbar at any viewport width
- [ ] Touch interactions work (tap = hover effects)

## 9. Security

- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] External links use `rel="noopener noreferrer"`
- [ ] No user-controlled strings in `href` or `src` without validation
- [ ] GitHub API token not exposed in client code
- [ ] No sensitive data in static export (check build output)
- [ ] Content Security Policy headers compatible with Three.js
- [ ] No inline event handlers (`onclick=` etc.)

## 10. Code Quality

- [ ] Consistent naming (camelCase for functions, PascalCase for components)
- [ ] Files under 300 lines (split if larger)
- [ ] No commented-out code
- [ ] No console.log statements (except in development guards)
- [ ] Error boundaries around Three.js canvases
- [ ] Graceful degradation if WebGL is unavailable
- [ ] Loading states for async data (SWR)
- [ ] Build passes with zero warnings: `npm run build`
- [ ] Type check passes: `npm run typecheck`
- [ ] Lint passes: `npm run lint`

---

## Review Severity Levels

| Level | Label | Action |
|-------|-------|--------|
| P0 | **Blocker** | Must fix before merge. Build broken, security issue, crash. |
| P1 | **Critical** | Must fix. Accessibility violation, performance regression, visual bug. |
| P2 | **Important** | Should fix. Code quality issue, minor visual mismatch. |
| P3 | **Nice-to-have** | Can defer. Style preference, optimization opportunity. |

---

## Review Template

When reviewing code, use this format:

```markdown
## Review: [Component/File Name]

### Summary
[1-2 sentence overall assessment]

### P0 — Blockers
- [ ] [Issue description] — [file:line]

### P1 — Critical
- [ ] [Issue description] — [file:line]

### P2 — Important
- [ ] [Issue description] — [file:line]

### P3 — Nice-to-have
- [ ] [Issue description] — [file:line]

### Approved: YES / NO / WITH CHANGES
```

---

## Contrast Check Reference

Quick reference for the design palette on black (#000000):

| Color | Hex | Contrast Ratio | WCAG AA | WCAG AAA |
|-------|-----|----------------|---------|----------|
| ink (primary) | #E8E4DE | 14.8:1 | PASS | PASS |
| ink-dim (secondary) | #8A8578 | 5.2:1 | PASS | FAIL (large text ok) |
| ink-faint (dividers) | #3A3832 | 2.1:1 | FAIL* | FAIL |
| accent (hover) | #C4B5A0 | 9.7:1 | PASS | PASS |

*ink-faint is only used for decorative elements (dividers, borders), never for readable text.
