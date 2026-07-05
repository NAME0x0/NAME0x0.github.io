# Task E10 — High-end interaction polish (owner-selected set)

Eight features. All obey: palette tokens only, reduced-motion = off/static (gsap.matchMedia or matchMedia guards), no new heavy deps (framer-motion + gsap already installed), transform/opacity animations only, server components stay server (leaf client wrappers).

## 1. Text scramble on hover — components/site/Scramble.tsx ("use client")
Wraps a text label; on mouseenter, decodes through random chars for ~220ms (charset `!<>-_\/[]{}=+*^?#01`, mono), settling to the real text left-to-right. Visual only: keep a stable `aria-label`, and render the scrambling text `aria-hidden` with the real text in an sr-only span. No scramble under reduced-motion or on touch (no hover). Apply to: Header nav labels, Footer social labels. Do NOT apply to body copy.

## 2. Scroll progress hairline — components/site/ProgressHairline.tsx ("use client")
Fixed top, full-width, 1.5px, `signal` at 70% opacity, `transform: scaleX(progress)` origin-left, updated via rAF on scroll (passive listener + rAF throttle). Mount in app/layout.tsx (all routes). Works under reduced-motion (it is a functional indicator, not decoration). z-index above header.

## 3. Live "last commit" — components/site/LastCommit.tsx (SERVER component)
Read `public/data/github-snapshot.json` at render (import or fs read via the existing snapshot types): find the most recent push timestamp across repos. Render in Footer: `last commit: {relative}` (e.g. "3h ago", "2d ago") in mono `dim`, with `title` = repo name + ISO date. Pure build-time value — no client fetch. Handle missing snapshot gracefully (render nothing).

## 4. Chapter index rail — components/site/ChapterRail.tsx ("use client")
Homepage only, hidden below lg. Fixed right edge, vertically centered `<nav aria-label="Chapters">`: 8 dots (anchor links to the section ids). IntersectionObserver highlights the current section (`aria-current="true"`, dot grows + bone color; others faint). Keyboard focusable with visible focus ring. Smooth-scrolls via native `scrollIntoView({behavior:"smooth"})` (auto under reduced-motion).

## 5. Magnetic CTAs — components/site/Magnetic.tsx ("use client")
framer-motion `useMotionValue`/`useSpring` wrapper (NO react state per move): child pulls toward cursor within a 120px radius, max offset 8px, spring back on leave. Apply to the two hero CTAs only. Disabled on touch + reduced-motion.

## 6. Spotlight borders — /work tier-1 cards
Client wrapper `components/site/SpotlightCard.tsx`: onMouseMove sets CSS vars (`--spot-x/--spot-y`) on the element (no state); an absolutely-positioned inset-0 pseudo layer renders `radial-gradient(220px at var(--spot-x) var(--spot-y), rgba(196,181,160,0.16), transparent 70%)` masked to a 1px border ring (border-box mask composite technique or a border-image approach — pick the cleanest that works with rounded-none). Apply to the four tier-1 cards on /work. No effect on touch.

## 7. Kinetic marquee — components/site/Marquee.tsx (server + CSS animation)
One full-width band between #light and #human on the homepage: repeating mono uppercase text `MEASURED · LIVE · SPEC / IN PROGRESS · SHIPPED · ` in `faint` (hover: `dim`), font-mono text-sm, tracking wide, border-y border-faint, py-4. CSS keyframes translateX(-50%) loop (~55s linear infinite; content duplicated 2x for seamless loop). `aria-hidden="true"`. Paused under reduced-motion (`animation: none`).

## 8. View Transitions (progressive) — lib/view-transitions.ts + components/site/TransitionLink.tsx
- `TransitionLink` ("use client"): renders next/link; onClick intercepts (same-origin, no modifier keys), and if `document.startViewTransition` exists calls `startViewTransition(() => router.push(href))`; else plain `router.push`. 
- Global CSS: `::view-transition-old(root){animation: vt-out 160ms ease both}` fade-out, `::view-transition-new(root){animation: vt-in 220ms ease both}` fade-in + translateY(10px)->0. Under reduced-motion: `::view-transition-old/new{animation: none}`.
- Shared element: give the /work card project names and the matching case-study h1 `viewTransitionName: cs-<slug>` (inline style) so the title morphs across navigation in supporting browsers.
- Replace links with TransitionLink at: Header nav, /work cards, homepage case-study links, case-page back-links. Leave external links alone.
- Comment clearly: progressive enhancement; unsupported browsers get instant nav.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npx next build`; `/` first-load ≤ 115 kB (framer-motion Magnetic must be code-split or tree-shaken — report exact). Report files + results.
