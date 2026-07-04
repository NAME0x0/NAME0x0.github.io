# The Machine — Muhammad Afsah Mumtaz — NAME0x0

Portfolio at [name0x0.vercel.app](https://name0x0.vercel.app). One scroll-driven film: a GPU is forged, boots, and thinks — while underneath, every page is plain server-rendered HTML that works with JavaScript disabled.

## What makes it unusual

- **Machine-verified honesty.** Every hard number on the site (benchmark scores, test counts, Brier scores) lives in `content/claims.json` and is checked against the source repos' live READMEs at build time (`scripts/verify-claims.mjs`). A mismatch fails the build. Gold (`signal`) coloring is reserved exclusively for verified values; projections are labeled PROJECTED.
- **The film degrades, never breaks.** WebGL film mounts only for capable devices (detect-gpu tier gate + reduced-motion + save-data checks, all offline — no CDN benchmark fetch). Everyone else gets the identical editorial page. A film runtime failure renders nothing and the page continues.
- **One continuous machine.** No cuts: a keyframe rail (sine-eased shared boundary knots) drives camera and card through 8 chapters; components accumulate — the GPU is visibly assembled as the story progresses. Model: "GeForce RTX 3080 Graphics Card" by _surovic_, CC-BY 4.0, compressed 12 MB → 1.66 MB (meshopt + WebP; see `public/models/ATTRIBUTION.md`).
- **Strict CSP throughout** — no `unsafe-eval` (WASM-only allowance for the meshopt decoder), no third-party origins beyond Vercel Analytics; all 3D assets self-hosted.

## Structure

```
app/            routes (all SSG; /work/[slug] case studies, /writing MDX, RSS, per-route OG)
components/
  film/         the 3D film (gate, canvas, rail, scenes)
  site/         server components + terminal easter egg
content/        zod-validated content layer — single source of copy + claims registry
lib/            content loaders, analytics, film progress store, GitHub snapshot pipeline
scripts/        prebuild: GitHub snapshot, claim verification, writing meta
docs/           BRIEF.md (design source of truth), ANALYTICS.md, task specs
```

## Develop

```bash
npm install
npm run dev        # local dev
npm run build      # prebuild pipeline (snapshot + claim verification) + next build
npm start
```

QA helpers: `/?film=force` mounts the film regardless of GPU tier; `&hud=1` adds a chapter/presence/assembly readout.

CI (GitHub Actions): lint, typecheck, banned-vocabulary grep, gitleaks, npm audit, build with claim verification, Lighthouse budgets (mobile perf ≥ 85, a11y/bp/seo ≥ 95).

## License

Code MIT. Content and personal media © Muhammad Afsah Mumtaz. Third-party model attribution in `public/models/ATTRIBUTION.md`.
