# The Machine — Muhammad Afsah Mumtaz — NAME0x0

My portfolio. It's a fast, crawlable, content-first site with a scroll-driven experience layer on top — every page is plain server-rendered HTML that works with JavaScript disabled, and the animation and 3D are enhancements that degrade cleanly when a device can't run them.

## What I care about here

- **Machine-verified honesty.** Every hard number on the site — benchmark scores, test counts, Brier scores — lives in `content/claims.json` and I check it against the source repos' live READMEs at build time (`scripts/verify-claims.mjs`). A mismatch fails the build, so I can't ship a stale claim. I reserve the gold (`signal`) colour for verified values only; anything projected is labelled PROJECTED and never animates.
- **It degrades, never breaks.** The WebGL scene widgets and atmosphere mount only on capable devices (a GPU/reduced-motion/save-data gate that runs entirely offline — no CDN calls). Everyone else gets the identical editorial page, and a runtime failure in an optional layer renders nothing rather than taking the page down.
- **The content is the point.** Four full case studies (AVA, Pantheon-Trades, OMNI, AGI-Ledger) with problem → constraints → architecture → war stories → results, each claim traceable to its repo. Plus `/writing` (MDX + RSS), a `/photos` gallery, and the usual `/about`, `/now`, `/cv`.
- **Strict CSP throughout** — no `unsafe-eval` (I allow `wasm-unsafe-eval` only for the meshopt decoder), no third-party origins beyond Vercel Analytics, all assets self-hosted.

## How it's built

- Next.js 14 (App Router, SSG), TypeScript strict, Tailwind.
- A typed, zod-validated content layer is the single source of copy — no strings hardcoded in JSX.
- Scroll-telling with GSAP (masked line-rise reveals, count-ups on verified numbers, a subliminal kinetic-wall background, per-section atmosphere).
- Bounded WebGL scene widgets (React Three Fiber) sit beside the case studies they illustrate; the `/photos` page ships masonry, a CSS-3D dome, and a WebGL sphere.

```
app/            routes (SSG; /work/[slug] case studies, /writing MDX + RSS, /photos, per-route OG)
components/     site UI, scroll-fx, gallery, scene widgets
content/        zod-validated content layer — copy + claims registry
lib/            content loaders, analytics, GitHub snapshot pipeline
scripts/        prebuild: GitHub snapshot, claim verification, photo processing
docs/           BRIEF.md, ANALYTICS.md, LAUNCH.md
```

## Develop

```bash
npm install
npm run dev        # local dev
npm run build      # prebuild (snapshot + claim verification + photo processing) then next build
npm start
```

CI (GitHub Actions) runs lint, typecheck, a banned-vocabulary grep, gitleaks, `npm audit`, the build with claim verification, and Lighthouse (accessibility / best-practices / SEO held at ≥ 0.95; performance floored with a median-of-3 to survive shared-runner noise — see `docs/LAUNCH.md`).

## License

Code is MIT. Content and personal media are © Muhammad Afsah Mumtaz. Third-party 3D model attribution is in `public/models/ATTRIBUTION.md`.
