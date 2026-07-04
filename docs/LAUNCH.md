# LAUNCH.md — distribution checklist for the owner

The site is ready when the acceptance checklist in docs/BRIEF.md §8 is green. This file is what YOU do around the launch. Work top to bottom.

## Pre-launch (before merging rebuild/machine to main)

- [ ] Full film pass on your own GPU: `npm run build && npm start`, scroll `/?film=force` slowly end-to-end. Judge: boundary smoothness, card rest orientation (known open item), fan spin in ch6, power-down.
- [ ] Phone pass: preview URL + `?film=force` on your phone; then WITHOUT the param confirm the editorial page serves cleanly on mobile.
- [ ] 30-second test on someone who isn't you: hand them a phone, 30s, ask them your name, one number they remember, and to find a case study. If they fail, tell Claude what confused them.
- [ ] Reduced-motion check: enable "reduce motion" in OS settings → site must show the editorial page, no film.
- [ ] Verify "Agora Hackathon" is the event's official public name (it's on /work/pantheon-trades).
- [ ] Supply the `whoami` photo (drop in public/assets/, tell Claude to wire it into the terminal).
- [ ] Push the branch → CI must be fully green (lint, typecheck, banned-vocab, gitleaks, audit, build+claims, Lighthouse budgets).
- [ ] Vercel preview: confirm analytics events fire in the dashboard (click a demo link, download CV, open a case study).
- [ ] securityheaders.com scan of the preview URL — expect A. CSP notes: 'unsafe-inline' scripts (SSG limitation, documented), 'wasm-unsafe-eval' (meshopt decoder, WASM-only).

## Launch

- [ ] Merge to main → production deploy on name0x0.vercel.app.
- [ ] github.io redirect: the GitHub Pages surface cannot serve real 301s. Options, pick one:
  1. Replace Pages content with a stub page: meta refresh + `<link rel="canonical" href="https://name0x0.vercel.app/">` + a visible link. (Do this at minimum.)
  2. Better: buy the custom domain (name0x0.dev is already in package metadata history), point it at Vercel, and make it canonical — then both vercel.app and github.io defer to it. Redirect equity transfers cleanly whenever you do this; before any public campaign is the right time.
- [ ] Search Console: add the property, submit sitemap.xml.
- [ ] Link-preview test: paste /, /work/ava, /writing/triton-fla-bitsandbytes-windows into WhatsApp/Discord/X — OG images should render with status labels.

## Distribution (the 6–18 month campaign)

- [ ] LinkedIn: update headline + featured link to the site. Post the rebuild with 2–3 film screenshots.
- [ ] GitHub profile README: link the site prominently; pin AVA, Pantheon-Trades, OMNI, AGI-Ledger.
- [ ] CV: ensure the PDF's link points at the site (the site links the CV; close the loop).
- [ ] HuggingFace profile: link the site from the AVA-v2 model card.
- [ ] X bio + pinned post.
- [ ] Show HN candidate: Pantheon-Trades ("Eleven AI agents deliberate every trade; refusals are recorded on-chain"). Lead with /demo (zero-cost, no wallet needed for replay). Post morning US time, weekday. Answer every comment honestly — the counter-evidence page IS the differentiator there.
- [ ] Writing pipeline: QLoRA-on-4GB post next (recruiter magnet), then the OMNI bandwidth-model essay. Each post: share to X + relevant subreddits (r/LocalLLaMA for both).
- [ ] Post-launch content drops: MALD, WebDesk, pane case pages when war stories are supplied.

## Monitoring

- [ ] Vercel Analytics funnel weekly: chapter_reached drop-off tells you which film chapter loses people; case_study_opened → cv_downloaded/email_clicked is the conversion that matters.
- [ ] Claim verification: if a source repo README changes a number, the next build fails loudly — update content/claims.json AND the site copy together.
