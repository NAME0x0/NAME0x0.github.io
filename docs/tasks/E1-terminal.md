# Task E1 — Chapter 2 terminal (Voice) with easter eggs

Context: The terminal is a REAL, focusable DOM component living in the `#voice` section of `app/page.tsx`. It must work for ALL users — film on or off (easter eggs reach everyone; the film later frames it in 3D). Design language: void bg, `faint` border, `ink` text, `bone` accents, `signal` only for verified numbers, Geist Mono everywhere (`font-mono`).

## 1. Component — components/site/Terminal.tsx ("use client")
Mount in `#voice` under the existing WebDesk row. Fixed height (~22rem, `overflow-y: auto` scrollback), border-faint frame, title bar `// TERMINAL` with a dry subtitle "the interface layer". Prompt line: `afsah@name0x0:~$ ` in `dim` + input (transparent, `ink`, no outline ring inside the frame but the FRAME gets the focus-visible ring). Clicking anywhere in the frame focuses the input. Do NOT steal focus on page load or on scroll (no autofocus).

State: array of output blocks (command echo + response), capped at last 200 lines. Up/Down arrow = command history. All rendering is plain React text nodes (no dangerouslySetInnerHTML).

## 2. Commands (case-insensitive, trim args)
Data comes from `content/projects.ts` + `content/identity.ts` — no copy duplication.
- `help` — lists EVERY command with one-line descriptions (discoverability is a hard requirement).
- `whoami` — identity.name + " — " + identity.handle, identity.role, location, one dry line: "photo pending. imagine someone who benchmarks at 3 a.m." (placeholder until owner supplies photo; leave a `// TODO(owner): swap in photo asset` comment).
- `ls` — lists project slugs (tier 1 first, then tier 2), status label in brackets.
- `cat <slug>` — project name, status, tagline, repo URL. Unknown slug → `cat: <slug>: no such project. try 'ls'`.
- `open <slug>` — navigates (window.location) to `/work/<slug>` for tier-1 slugs; for tier-2, opens repo URL in new tab. Mention in help.
- `sudo <anything>` — "nice try. this machine has exactly one operator."
- `rm -rf /` (also `rm -rf /*`) — the machine refuses: "refused. restraint is recorded on-chain around here." (dry Pantheon callback).
- `trackmania` — "current obsession: the endless pursuit of a cleaner racing line. improvement has no finish line."
- `clear` — clears scrollback.
- `exit` — "there is no exit. scroll on." plus it blurs the input.
- `neofetch` — small ASCII block: NAME0x0 / role / "GPU: 4 GB VRAM (yes, really)" / "OS: whatever runs the machine" + one signal-colored verified line: "ARC-C 82.0%".
- Unknown command — `command not found: <cmd>. try 'help'`.

## 3. Konami code — components/site/Konami.tsx ("use client", mounted on homepage)
Global keydown listener for ↑↑↓↓←→←→BA. On trigger: document.body gets `data-konami="on"` for 4 seconds. CSS (globals.css): while on, invert the site's palette briefly (filter: invert(1) hue-rotate(180deg) on html, transition 300ms) — a 4-second glitch of light in the dark cathedral. Also prints a line into the terminal if it's mounted ("konami acknowledged. the machine sees you."). Cleanup timer properly.

## 4. Idle hint carousel
When the terminal has had NO interaction ever (this page view): every 6s the placeholder attribute of the input cycles through: `try: whoami`, `try: help`, `try: ls`, `try: neofetch`, `try: sudo make me a sandwich`. Stops cycling permanently after first keystroke. This is the discoverability requirement — users must find easter eggs without prior knowledge.

## 5. Accessibility
- The terminal region: `role="region"`, `aria-label="Interactive terminal"`. Output container `aria-live="polite"`.
- Input has an sr-only `<label>`. Fully keyboard operable. The frame's focus ring: `focus-within:outline` bone.
- Reduced-motion users: no CSS animations in the terminal (hint carousel is text swap, fine; konami invert must be instant-off under prefers-reduced-motion — wrap the transition in a media query).

## Hard constraints
- No new deps. No dangerouslySetInnerHTML. Banned vocab rules apply to ALL response strings (no "sovereign", no "architect" as self-title, OMNI never "runs").
- Server component pages stay server: Terminal and Konami are leaf client components.
- `npx tsc --noEmit`, `npm run lint`, `npx next build` (font mock allowed) all pass; `/` first-load JS ≤ 115 kB (terminal may add a few kB; report the number).
