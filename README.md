# NAME0x0 Portfolio

## About

This repository contains the production source for a cinematic, single-page portfolio built to present systems architecture work through interactive motion, 3D visuals, and curated project data.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger)
- Three.js + React Three Fiber
- SWR

## Data flow

Project data uses a hybrid GitHub pipeline:

1. Build-time snapshot at `public/data/github-snapshot.json`
2. Runtime refresh from GitHub API
3. Automatic fallback to the snapshot when live fetch fails

## Local development

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run snapshot   # refresh GitHub snapshot data
npm run lint       # eslint (Next.js config)
npm run typecheck  # tsc --noEmit
npm run build      # static export (writes to out/)
```

`npm run build` executes `prebuild`, which refreshes the snapshot automatically.

## CI/CD

GitHub Actions workflow: `.github/workflows/nextjs.yml`

- Runs on `pull_request` and `push` to `main`
- Enforces `lint` and `typecheck` before build
- Builds static output and deploys to GitHub Pages on non-PR runs
