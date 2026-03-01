# NAME0x0 Portfolio (Next.js + Three.js)

Single-page portfolio rebuilt for high-end hiring and personal brand presence.

## Visual system

- Systems-minimal typography and spacing rhythm
- Layered topographic 3D terrain
- Grunge abstract strata overlays
- Dot-matrix field animation inspired by hardware UI language
- Scroll-cinematic section orchestration via GSAP

## Stack

- Next.js 14 (static export for GitHub Pages)
- TailwindCSS
- GSAP ScrollTrigger
- Three.js / React Three Fiber
- SWR

## Data model

Hybrid repository pipeline:

1. Build-time snapshot at `public/data/github-snapshot.json`
2. Runtime live refresh from GitHub API
3. Automatic fallback to snapshot when live refresh is unavailable

## Scripts

```bash
npm run dev
npm run snapshot   # refresh local snapshot
npm run typecheck
npm run lint
npm run build
```

`npm run build` runs the snapshot script automatically through `prebuild`.
