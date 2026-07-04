# Task E17 — Nav system: PillNav top bar + StaggeredMenu hamburger

References in `docs/vendor-reference/PillNav.*` and `StaggeredMenu.*` (ReactBits, MIT — David Haz). Adapt to TSX + our palette; keep a one-line MIT credit comment in each. Palette: void #000, ink #E8E4DE, dim #8A8578, faint #3A3832, bone #C4B5A0, signal #E3B341. GSAP is installed. The existing Header (components/site/Header.tsx) is replaced by this system.

## 1. PillNav — components/site/PillNav.tsx ("use client")
Adapt PillNav.jsx/css. Persistent top bar on ALL breakpoints.
- Logo slot: the lockup "Muhammad Afsah Mumtaz — NAME0x0" (identity.lockup) at left, links to `/`. (The reference uses a circular logo image; use our text lockup instead, keep it left-aligned.)
- Pill items (right-aligned, condense on mobile): Work, Writing, About, Now, Photos, CV. Each pill: base transparent with faint border; on hover the ReactBits circular-reveal pill fill animates in (`bone` fill, `void` text on hover) with the two-layer label swap. Active route pill is filled `bone`/void (detect via usePathname).
- Uses our TransitionLink for internal navigation (keep view-transitions working). Scramble hover is REPLACED by PillNav's own hover animation here (don't double up).
- Far-right: a **hamburger button** (three lines → X morph) that opens the StaggeredMenu (§2). Visible on all breakpoints. On mobile (<md) the pill items collapse and the hamburger is the primary nav; lockup + hamburger remain.
- Respect reduced-motion: pills still work, hover fill is instant not animated.
- Keyboard: pills and hamburger focusable, visible bone focus ring, aria-current on active.

## 2. StaggeredMenu — components/site/StaggeredMenu.tsx ("use client")
Adapt StaggeredMenu.jsx/css. Fullscreen overlay opened by the hamburger.
- On open: colored panel(s) slide in from the right (use void → soot layered panels, subtle), then large menu items stagger in (GSAP): big display-font numbered links — 01 Work, 02 Writing, 03 About, 04 Now, 05 Photos, 06 CV. Each links to its route (TransitionLink; CV is /cv).
- Social row at the bottom: GitHub, LinkedIn, X, HuggingFace (from identity.socials), external rel.
- **Photos gets the Folder treatment**: the "05 Photos" item includes the small `components/gallery/Folder.tsx` (peeking thumbnails) beside/above it — the one item with a visual, others are text. Clicking it navigates /photos.
- Close: hamburger becomes X; Escape closes; clicking a link closes then navigates; focus trap while open; body scroll locked while open; restore focus to hamburger on close.
- accent = signal for the numbers, bone for labels. Reduced-motion: appears/disappears instantly, no stagger.
- a11y: role="dialog" aria-modal, aria-label "Menu", the hamburger has aria-expanded + aria-controls.

## 3. Wire-in
- Replace `<Header />` in app/layout.tsx with the new `<PillNav />` (PillNav renders both the bar and mounts the StaggeredMenu, controlling open state internally or via a shared context — keep it self-contained).
- Remove the old Header.tsx usage (keep the file, unused). Keep Scramble.tsx for Footer only (Footer nav labels keep scramble; nav bar uses PillNav hover).
- ChapterRail, ProgressHairline, everything else unchanged.
- After building, DELETE docs/vendor-reference/ entirely (both remaining files consumed).

## Constraints & checks
- No new deps. Reduced-motion + keyboard + focus-trap correct. Server components stay server; PillNav + StaggeredMenu are client leaves.
- `/` first-load ≤ 120 kB (GSAP already loaded elsewhere; PillNav/StaggeredMenu add little — report exact).
- `npx tsc --noEmit`, `npm run lint`, `npx next build`. Report files + results + first-load JS.
