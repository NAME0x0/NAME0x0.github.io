# Design & Build Brief — "The Machine"

**Project:** Ground-up rebuild of NAME0x0.github.io → the personal portfolio of
**Muhammad Afsah Mumtaz — NAME0x0**
**Status:** DRAFT — awaiting owner sign-off (Phase A gate)
**Date:** 2026-07-03

---

## 1. Agreed Scope (from consultation, 2026-07-03)

| Decision | Outcome |
|---|---|
| Timeline | No hard deadline; each phase timeboxed and shipped as a deployable milestone |
| Chapter order | Proof → Product → Ambition confirmed: AVA → Pantheon → OMNI |
| Case-study pages, v1 launch gate | 4 Tier 1 pages: `/work/ava`, `/work/pantheon-trades`, `/work/agi-ledger`, `/work/omni` |
| Case-study pages, post-v1 content drops | MALD, WebDesk, pane (each gated on owner-supplied war stories) |
| /writing at launch | Triton-on-Windows post (migrated from existing gist) |
| /writing post-launch | QLoRA-on-4GB post; OMNI bandwidth-model essay |
| Domain | Canonical: `portfolio.afsah.xyz` (afsah.xyz registered at Porkbun, `portfolio` CNAME → Vercel). `name0x0.vercel.app` 308s to it via a host-matched rule in `next.config.mjs`; `name0x0.github.io` bounces via the Pages stub. Root `afsah.xyz` reserved for a separate landing page |
| Hosting | Vercel primary; GitHub Pages repo becomes redirect stub |
| Scroll/animation | Lenis + Framer Motion; port AGI-Ledger particle-morph patterns (verified in source: MeshSurfaceSampler → single particle buffer, custom point shader dissolve, canvas glow sprite, `frameloop="never"` when inactive, DPR capped 1.25–1.5 via PerformanceMonitor) |
| Analytics | Vercel Analytics only; funnel events per §7 of master prompt; documented in `docs/ANALYTICS.md` |
| Perf budget | Master-prompt §6 defaults; GPU floor raised to **iPhone 13-class** — older devices get the designed static/editorial experience |
| Voice | Derived from AGI-Ledger README + Triton gist (owner's published writing) |
| Palette | Evolve existing void-black/warm-ink system; per-chapter accent temperature; Human chapter deliberately inverts |
| War stories | Owner interviewed per project during Phase C; 3 bullets each; never fabricated |
| "Now" widget | `content/now.md`, zod-validated frontmatter, honest "last updated" date shown |
| Numbers | Trust current READMEs; snapshot script cross-checks claims at build; mismatch fails the build loudly |
| Easter eggs | `whoami`, `help`, konami, `ls`/`cat <project>`, `sudo` joke, `rm -rf /` refusal, `trackmania`. **Discoverability requirement:** `help` lists everything + idle terminal cycles hint suggestions ("try: whoami") so no visitor needs prior knowledge |

**Banned vocabulary (site-wide, CI-greppable):** "sovereign architect", "secure enclave", "SYS.INIT", any seniority-implying title. OMNI never "runs" — always "targeting / designed to".

---

## 2. Sitemap

```
/                     The Machine (scroll film + full server-rendered content fallback)
/work                 Index: 4 Tier 1 cards + Tier 2 rows (one line + repo link each)
/work/ava             MEASURED   — case study
/work/pantheon-trades LIVE       — case study
/work/omni            SPEC / IN PROGRESS — case study
/work/agi-ledger      LIVE       — case study
/work/mald            (post-v1)  SHIPPED
/work/webdesk         (post-v1)  SHIPPED
/work/pane            (post-v1)  SHIPPED (MVP)
/writing              Index + RSS
/writing/triton-fla-bitsandbytes-windows   (launch)
/writing/qlora-4gb                          (post-v1)
/writing/omni-bandwidth-model               (post-v1)
/about                Identity, roles, affiliations, open-to lines
/now                  Rendered content/now.md
/cv                   Single public "General" CV PDF (four-variant wall removed)
/404                  In-voice ("this route was never trained on")
sitemap.xml, robots.txt, /writing/rss.xml, per-route OG images (generated)
```

Every route SSG. Every route complete with JS disabled (3D excepted). Case-study pages are the SEO surface; the film deep-links into them.

---

## 3. Design Tokens

### Palette (evolved, not restarted)

| Token | Hex | Role |
|---|---|---|
| `void` | `#000000` | Background, chapters 0–6 |
| `ink` | `#E8E4DE` | Primary text on void |
| `dim` | `#8A8578` | Secondary text, captions |
| `faint` | `#3A3832` | Rules, borders, dormant machine parts |
| `bone` | `#C4B5A0` | Base accent: active machine parts, links, focus rings |
| `ember` | `#D08C5A` | Ignition heat, Council veto flash, warnings |
| `signal` | `#E3B341` | Measured numbers ONLY — benchmark bars, test counts. If it glows signal-gold, it's a verified fact |
| `paper` | `#F2EDE4` | Human chapter background (the inversion) |
| `soot` | `#1C1A17` | Text on paper |

Rule: `signal` is reserved for verified data. Decorative use is a review-blocking defect. This makes honesty a *visual* system, not just labels.

### Typography
- **Display:** Space Grotesk (2 weights: 500, 700)
- **Body:** Manrope (2 weights: 400, 600)
- **Data/terminal:** Geist Mono (400)
- `next/font`, subset latin, ≤4 total weight files. Section overlines in Geist Mono, terminal-style: `// PROOF`, `// COUNCIL`, `// BLUEPRINT`… (the old `// INIT` grammar survives; "SYS.INIT" the phrase does not).

### Layout concept
12-col grid, generous void. Content column max ~68ch. Marginalia asides (dry, first-person: "yes, I benchmarked this at 3 a.m.") set in Geist Mono `dim`, hanging in the outer margin on desktop, inline-collapsed on mobile.

### The signature element: **no cuts** — REVISED 2026-07-03 (owner direction)
The Machine is a **GPU being forged, then awakened**. One continuous object, zero hard transitions.

- **Act I — Forged (ch 0–2):** solid geometry. Bare silicon die → PCB rises → VRAM/VRM/heatsink assemble in exploded-view keynote choreography. Photoreal PBR materials (procedural in-code: metalness/roughness/normal maps + environment lighting — no multi-MB downloaded model), lit in our palette: bone key light, ember heat, void background. Specs engrave as parts attach; the die is marked **"4 GB"** — the constraint is the character. Custom card, no NVIDIA trademarks.
- **Act II — Awakened (ch 3–6):** the card boots; computation becomes visible as light/particles rising off the die (AVA benchmarks, the council, the torus, the cosmos). Particles are what the silicon is *doing*, not decoration.
- **Ch 7:** power-down — light settles to dust, page inverts to paper.

Matter → thought → human: the film enacts the positioning line. The GPU never leaves frame; a visitor scrolling the whole film never sees the machine replaced — only forged, then thinking.

---

## 4. Chapter Storyboard — v2, REVISED 2026-07-03 (GPU forge → awaken)

Scroll progress `p ∈ [0,1]` split into 8 windows with transition bands. Each chapter's copy also exists in the server-rendered content flow (the current editorial page is the film's DOM layer and its complete fallback).

| # | Chapter | GPU state | Camera | Copy + data | Transition out |
|---|---|---|---|---|---|
| 0 | **Ignition** | Bare silicon die alone in void, edge-lit `bone`, **"4 GB" engraved**; name lockup resolves above it | Slow push-in from void | Lockup; positioning line; CTAs → /work/ava, contact. Loader ≤2s fast-4G; ch-0 assets only | PCB rises from darkness to meet the die |
| 1 | **Metal — forged** | Exploded-view assembly: VRAM modules, VRM stages, heatsink fins fly in and seat (keynote grammar). Board components carry project labels: MALD, pane solid `bone`; MAVIS, Terminus `faint` wireframe SPEC parts | Slow orbit through the exploded board | One honest line per component; SHIPPED solid vs SPEC wireframe | Shroud closes; card complete |
| 2 | **Voice — interface** | Card's I/O edge faces camera; terminal projects above the display connector (real focusable input: `whoami`, `help`, `ls`/`cat`, `sudo`/`rm -rf /` refusal, `trackmania`, konami; idle hint carousel for discoverability) | Settle head-on to I/O edge | Interface-layer story, one sentence | Power connector seats; fans spin up — **boot** |
| 3 | **Mind — AVA (proof)** | **Awakened.** Light rises off the die: benchmark columns in `signal` over the VRAM — ARC-C 82.0 / ARC-E 92.0 vs 78.6 baseline; 42 MB adapter mass vs base-model mass | Slow dolly along the board at die height | MEASURED; 17-benchmark / 16,872-task harness. → /work/ava | Light columns split into eleven nodes |
| 4 | **The Council — Pantheon** | Eleven agent lights deliberate above the card; arguments as light exchanges; Eris flares `ember` on the minority side; veto flash; a refused trade seals (Proof of Restraint) | Orbit the chamber of lights, pause on veto | LIVE → demo + /work/pantheon-trades. Brier 0.149 in `signal`; never "trading bot" | Nodes snap into a lattice |
| 5 | **The Blueprint — OMNI** | 8×4×4 torus lattice hologram over the card, wireframe/schematic; top-1 routing as travelling light; ternary particles in 3 states | Slow reveal of torus topology | Persistent ember label: **RESEARCH IN PROGRESS — projections, not measurements**; 243 tests. → /work/omni | Torus expands into stars |
| 6 | **Light — AGI-Ledger** | Star cosmos above the card — visual quote of AGI-Ledger | Drift among stars, card dim below | LIVE; ~22 takes; falsifier rule. → /work/agi-ledger | Stars dim; fans slow |
| 7 | **The Human** | **Power-down:** light settles to dust on the board; background inverts to `paper` | Static, editorial | Warm break: photos, Tangled, Now widget, contact block, one CV. Marginalia asides live in this voice | — |

**Fallbacks (designed, not degraded):** `prefers-reduced-motion`, no-WebGL, and below-floor GPUs all get the same editorial version — full copy, designed poster image per chapter, chapter jump-list nav. This version is reviewed to the same standard as the film. Mobile below iPhone 13-class: same editorial version. Heavy chapters (4, 5) may additionally use pre-baked video on mid-tier mobile — decided per chapter at Phase E with measurements.

---

## 5. Technical Architecture

- Next.js 14+ App Router, TypeScript strict, Tailwind. R3F + drei + three. Lenis (scroll) + Framer Motion (DOM) + custom shader morphs (canvas).
- Content layer: `content/` — typed TS/MDX with zod-validated frontmatter. No copy hardcoded in JSX.
- Snapshot pipeline: extend `scripts/fetch-github-snapshot.mjs` — build-time fetch (token env-only, CI-only), committed JSON fallback, **claim cross-check step** (numbers in content vs live README; mismatch = build fails), sanitize all GitHub-originated strings.
- 3D budget — REVISED 2026-07-03 (owner direction): three tiers on the FilmMount gate.
  - **high** (desktop detect-gpu tier 3): hero GLB card (CC-BY, re-skinned in-engine: brand stripped, palette materials, "4 GB / NAME0x0" decals, ATTRIBUTION.md credit) + self-hosted HDRI; payload ≤ 20 MB compressed (gltf-transform: Draco/meshopt + KTX2), lazy-loaded after first paint while chapter 0 plays procedurally; DPR ≤ 2.
  - **base** (desktop tier 2 / mobile tier 3): fully procedural film (kilobytes), DPR ≤ 1.5 — unchanged.
  - **off**: editorial page.
  - CSP stays strict — all assets self-hosted under /public ('self'). No postprocessing in either tier (additive glow sprites); `frameloop="never"` off-screen/hidden/paper-covered.
- CI gates (GitHub Actions): lint, typecheck, Lighthouse CI (mobile: Perf ≥85 / A11y ≥95 / BP ≥95 / SEO ≥95), gitleaks secret scan, `npm audit`, banned-vocabulary grep.
- Security headers via Vercel config: CSP (no unsafe-eval; nonce'd inline; allowlist Vercel Analytics + api.github.com), HSTS, nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy deny camera/mic/geo, frame-ancestors 'none'.
- JSON-LD: `Person` (alternateName NAME0x0, sameAs GitHub/LinkedIn/X/HuggingFace) sitewide; `SoftwareSourceCode` per case study; `Article` per post.
- Analytics funnel: `chapter_reached(0–7)`, `case_study_opened(slug)`, `demo_clicked`, `cv_downloaded`, `email_clicked`, `github_clicked`, `writing_read_50pct`.

---

## 6. Asset List

| Asset | Owner | Status |
|---|---|---|
| Headshot | Owner | EXISTS — needs EXIF strip + crop pass |
| 3–6 casual photos (Human ch.) | Owner | EXISTS — EXIF strip, curation with me |
| Project screenshots/recordings | Owner | EXISTS — per-page selection at Phase C |
| Logo/monogram | Owner | EXISTS — needs SVG/favicon derivation |
| GLB morph targets ×8 (die, machine, terminal, graph, chamber, torus, cosmos, dust) | Me | To model/generate — low-poly sources, sampled to particles |
| Chapter poster images (fallback + OG) | Me | Generated from 3D scenes at build |
| War stories (3 bullets × 7 projects) | Owner (interviewed) | Phase C per page |
| Triton gist → MDX | Me (owner reviews) | Phase C |
| QLoRA post, OMNI essay | Owner drafts, I edit | Post-v1 |
| General CV PDF | Owner | Confirm current version at Phase C |

---

## 7. Build Phases & Milestone Gates

- **B — Skeleton:** restructure, routes, typed content layer, snapshot+cross-check, CI gates, headers, analytics, redirects. *Gate: content-only site already beats current portfolio.*
- **C — Case studies & writing:** 4 Tier 1 pages (war-story interviews happen here), Tier 2 index rows, /writing + Triton post, OG generation. *Gate: deployable, crawlable, recruiter-complete.*
- **D — Film, hook-proof-human:** chapters 0, 3, 7 + full fallback system. *Gate: 30-second test passes on mid-range phone.*
- **E — Remaining chapters:** 1, 2, 6 then 4, 5 (heaviest last), each perf-checked individually.
- **F — Polish & launch:** easter eggs complete, 404, QA matrix, budget re-verification, `docs/LAUNCH.md`.
- **Post-v1 content drops:** MALD/WebDesk/pane pages; QLoRA + OMNI posts; custom domain purchase + canonical migration.

Each milestone: demo state shown, deviations listed, owner approval before next phase.

---

## 8. Acceptance Checklist (verified + reported at launch)

1. `curl` of every route returns full text content — no empty sections, no "--" placeholders.
2. All §6 budgets pass in CI on final build; achieved Lighthouse score published in footer.
3. JS disabled: every page readable/navigable. Reduced-motion: designed editorial experience.
4. Every factual claim matches ground truth / live repo data; status labels present; OMNI never "runs".
5. Banned vocabulary absent (CI grep); lockup "Muhammad Afsah Mumtaz — NAME0x0" in title, header/footer, OG, JSON-LD.
6. One canonical domain; others 301; sitemap + RSS valid; OG images verified in link-preview test.
7. securityheaders.com A (or documented platform limits); no secrets in history; secret-scan green.
8. Full keyboard pass (film chapter jump-list included); a11y ≥95; contrast AA verified over 3D.
9. All funnel events verified firing in dashboard; `docs/ANALYTICS.md` + `docs/LAUNCH.md` exist.
10. Stranger, mid-range phone, 30 seconds: name + one hard number + reach a case study.

---

## 9. Self-Critique (anti-genericness pass)

- **"Particles morphing on scroll" is 2024-template-adjacent.** Survives because: single persistent buffer across 8 semantically-motivated states (not decorative morphs), benchmarks rendered inside the scene, and the no-cuts rule. The defense isn't the technique — it's that every state is a real project's real shape.
- **Terminal easter eggs are a portfolio cliché.** Kept because Voice is an actual chapter of the story (interface layer = what he builds), the terminal navigates for real, and discoverability is designed in. Cut if it tests as gimmick in Phase E.
- **`signal`-gold = verified-data-only is the least generic idea in this brief** — honesty as a color system. Protect it in review.
- **Human-chapter paper inversion** risks "quirky about page". Mitigation: same grid discipline, casual only in content, not in craft.
- **Dropped from consideration:** cream+serif+terracotta, black+acid-green, broadsheet hairlines (explicitly banned generic looks); loading-percentage counters; skill bars; "passionate" copy — all absent by design.

---

*Sign-off line: approved by owner → Phase B begins.*
