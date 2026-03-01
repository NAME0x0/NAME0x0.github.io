# MASTER ORCHESTRATION PLAN
## Portfolio Redesign — NAME0x0 / Muhammad Afsah Mumtaz

---

## Vision

A **Web3-cinematic personal portfolio** that feels like stepping into a sovereign digital realm. Black void canvas. Off-white typographic ink. The **Creation of Adam** hands rendered in animated ASCII dot-matrix shading as the centrepiece motif — two intelligences reaching toward each other across the void. Every surface is procedural, every interaction is physics-aware, every section tells a story.

---

## Aesthetic Pillars

| Pillar | Description |
|--------|-------------|
| **Void Canvas** | Pure black (#000000) background — no gradients, no noise, just depth |
| **Off-White Ink** | Primary text and UI elements in off-white (#E8E4DE) — warm, analog feel |
| **ASCII Dot-Matrix** | Key visuals rendered as stippled/dot-shaded ASCII art — the Creation of Adam hands |
| **Web3 Glass** | Frosted glass cards with subtle borders, no fills — floating in the void |
| **Procedural Motion** | WebGL shaders drive all background animation — nothing is a video loop |
| **Monospace Authority** | Terminal-grade typography mixed with refined serif for headings |

---

## Tool Assignments

| Role | Tool | What It Does |
|------|------|--------------|
| **Architect & Reviewer** | Claude (Opus 4.6) | Writes the plan, reviews all code, orchestrates handoffs, manages quality |
| **Frontend Designer** | Gemini 3.1 Pro (Antigravity) | Designs component architecture, shader logic, layout systems, CSS |
| **Image Generator** | Nano Banana 2 (via Gemini/AI Studio) | Generates the Creation of Adam ASCII art frames, textures, visual assets |
| **Video Generator** | Veo 3.1 (via Gemini/AI Studio) | Animates the ASCII hands reaching, creates background motion loops |
| **Code Implementer** | GPT-5.3-Codex xhigh (CLI) | Writes production code — React components, GLSL shaders, GSAP timelines |
| **Wireframe Tool** | Figma | Static wireframes and layout specification |
| **Identity Research** | ChatGPT + Gemini | Analyze who Afsah is to inform the design personality |

---

## Phases

### Phase 0 — Identity Discovery
**Goal:** Understand who Muhammad Afsah Mumtaz is as a person, developer, and brand.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 0.1 | Ask ChatGPT for a personality brief | ChatGPT | `identity-chatgpt.md` |
| 0.2 | Ask Gemini for a personality brief | Gemini 3.1 Pro | `identity-gemini.md` |
| 0.3 | Claude synthesizes both into a design persona | Claude | Section in this doc |

**Prompts:** See `01-DISCOVER-IDENTITY.md`

---

### Phase 1 — Wireframe Design (Figma)
**Goal:** Establish the spatial layout, scroll structure, and component hierarchy.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 1.1 | Create desktop wireframe (1440px) | Figma | Desktop frame |
| 1.2 | Create mobile wireframe (390px) | Figma | Mobile frame |
| 1.3 | Annotate scroll triggers and animation zones | Figma | Annotations layer |
| 1.4 | Define the ASCII hands placement and scale | Figma | Hero composition |

**Specification:** See `02-FIGMA-WIREFRAME.md`

---

### Phase 2 — Asset Generation (Nano Banana 2 + Veo 3.1)
**Goal:** Generate the visual assets — ASCII Creation of Adam hands, textures, animated backgrounds.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 2.1 | Generate static ASCII dot-shaded hands (multiple angles) | Nano Banana 2 | PNG frames |
| 2.2 | Generate dot-matrix texture patterns | Nano Banana 2 | Tileable textures |
| 2.3 | Animate the hands reaching sequence | Veo 3.1 | MP4/WebM loop |
| 2.4 | Generate ambient particle/void animations | Veo 3.1 | Background loops |
| 2.5 | Claude reviews assets for consistency | Claude | Approval/revision notes |

**Prompts:** See `04-GEMINI-ASSETS-PROMPTS.md`

---

### Phase 3 — Frontend Architecture (Gemini 3.1 Pro)
**Goal:** Design the complete frontend system — components, shaders, animations, data flow.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 3.1 | Design component tree and file structure | Gemini (Antigravity) | Architecture doc |
| 3.2 | Write GLSL shader specifications | Gemini (Antigravity) | Shader pseudocode |
| 3.3 | Design the scroll orchestration system | Gemini (Antigravity) | Animation timeline |
| 3.4 | Specify the design token system | Gemini (Antigravity) | Updated tokens.ts |
| 3.5 | Design responsive breakpoint behavior | Gemini (Antigravity) | Responsive spec |
| 3.6 | Claude reviews architecture | Claude | Approval/revision notes |

**Prompts:** See `03-GEMINI-FRONTEND-PROMPTS.md`

---

### Phase 4 — Code Implementation (GPT-5.3-Codex xhigh)
**Goal:** Write production code for every component, shader, animation, and integration.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 4.1 | Implement design tokens and global styles | Codex CLI | `tokens.ts`, `globals.css` |
| 4.2 | Build the ASCII hands WebGL component | Codex CLI | `AsciiHands.tsx` + shaders |
| 4.3 | Build Hero section with hands animation | Codex CLI | `Hero.tsx` |
| 4.4 | Build Sovereign Stack section | Codex CLI | `SovereignStack.tsx` |
| 4.5 | Build Projects section with Web3 cards | Codex CLI | `Projects.tsx` |
| 4.6 | Build Contact/Footer section | Codex CLI | `Contact.tsx` |
| 4.7 | Build scroll orchestration (GSAP) | Codex CLI | `SectionOrchestrator.tsx` |
| 4.8 | Integrate all sections into page.tsx | Codex CLI | `page.tsx` |
| 4.9 | Claude reviews all code | Claude | Approval/revision notes |

**Prompts:** See `05-CODEX-IMPLEMENTATION-PROMPTS.md`

---

### Phase 5 — Review & Polish (Claude)
**Goal:** Ensure everything meets quality standards.

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 5.1 | Code review (logic, security, performance) | Claude | Review notes |
| 5.2 | Accessibility audit | Claude | ARIA/a11y fixes |
| 5.3 | Performance profiling | Claude | Optimization list |
| 5.4 | Visual fidelity check against wireframes | Claude | Discrepancy notes |
| 5.5 | Mobile responsiveness verification | Claude | Breakpoint fixes |
| 5.6 | Final build test | Claude | Build pass/fail |

**Checklist:** See `06-CLAUDE-REVIEW-CHECKLIST.md`

---

## Section Map (New Design)

```
┌──────────────────────────────────────────────────────┐
│  SECTION 0: // INIT                                  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Black void.                                    │  │
│  │                                                 │  │
│  │  CENTER: ASCII dot-shaded Creation of Adam      │  │
│  │  hands — animated, reaching toward each other   │  │
│  │  Left hand = human / Right hand = machine       │  │
│  │                                                 │  │
│  │  "MUHAMMAD AFSAH MUMTAZ" (below hands)          │  │
│  │  "Systems Architect · AI Engineer · OS Dev"     │  │
│  │  NO TAGLINE — the hands ARE the statement       │  │
│  │                                                 │  │
│  │  Subtle particle field drifting in void          │  │
│  │  Scroll indicator at bottom                     │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 1: // ARCHITECTURE                          │
│  ┌────────────────────────────────────────────────┐  │
│  │  overline: "// ARCHITECTURE"                    │  │
│  │  "THE STACK" — left-aligned heading             │  │
│  │  5 horizontal layers, each with:                │  │
│  │    - Layer name + tech tags                     │  │
│  │    - Description text                           │  │
│  │    - Thin border separator                      │  │
│  │  Layers reveal on scroll (staggered)            │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 2: // DEPLOYMENTS                           │
│  ┌────────────────────────────────────────────────┐  │
│  │  overline: "// DEPLOYMENTS"                     │  │
│  │  "WORK" — left-aligned heading                  │  │
│  │  Filter tabs: All / Foundation / Interface /    │  │
│  │    Intelligence / Visualization / Tools         │  │
│  │  OMNI featured first (flagship)                 │  │
│  │  Project cards in 2-col grid (desktop):         │  │
│  │    - Glass border, no fill                      │  │
│  │    - Project name in off-white                  │  │
│  │    - Description, language badge, links         │  │
│  │    - Hover: subtle glow + card lift             │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 3: // IDENTITY                              │
│  ┌────────────────────────────────────────────────┐  │
│  │  overline: "// IDENTITY"                        │  │
│  │  "ABOUT" — split layout                         │  │
│  │  Left: Brief bio text, capabilities list        │  │
│  │  Right: GitHub stats, language distribution     │  │
│  │  Background: slow-drifting dot-matrix field     │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  SECTION 4: // UPLINK                                │
│  ┌────────────────────────────────────────────────┐  │
│  │  overline: "// UPLINK"                          │  │
│  │  "LET'S BUILD" — centered heading               │  │
│  │  Email link, social links (text, not icons)     │  │
│  │  Minimal footer with copyright                  │  │
│  │  Background: ASCII hands motif (zoomed,         │  │
│  │  cropped, faded) as a callback to hero          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `void` | `#000000` | Page background, section backgrounds |
| `ink` | `#E8E4DE` | Primary text, headings, borders |
| `ink-dim` | `#8A8578` | Secondary text, muted labels |
| `ink-faint` | `#3A3832` | Dividers, subtle borders |
| `accent` | `#C4B5A0` | Warm accent for hover states, active elements |
| `glow` | `#E8E4DE10` | Card backgrounds (near-invisible fill) |
| `dot` | `#E8E4DE` | ASCII dot-matrix rendering color |

---

## Typography

| Role | Font | Weight | Size (desktop) |
|------|------|--------|-----------------|
| Display (name) | Space Grotesk | 700 | 72px |
| Heading | Space Grotesk | 600 | 36px |
| Subheading | Geist Mono | 400 | 14px, uppercase, tracked |
| Body | Manrope | 400 | 16px |
| Code/Label | Geist Mono | 400 | 13px |

---

## File Inventory

```
orchestration/
├── 00-MASTER-PLAN.md              ← You are here
├── 01-DISCOVER-IDENTITY.md        ← Prompts for ChatGPT + Gemini (who am I?)
├── 02-FIGMA-WIREFRAME.md          ← Figma wireframe specification
├── 03-GEMINI-FRONTEND-PROMPTS.md  ← Prompts for Gemini 3.1 Pro (Antigravity)
├── 04-GEMINI-ASSETS-PROMPTS.md    ← Prompts for Nano Banana 2 + Veo 3.1
├── 05-CODEX-IMPLEMENTATION-PROMPTS.md ← Prompts for GPT-5.3-Codex xhigh
└── 06-CLAUDE-REVIEW-CHECKLIST.md  ← Claude's review criteria
```

---

## Workflow Summary

```
Phase 0          Phase 1         Phase 2          Phase 3           Phase 4          Phase 5
┌──────────┐    ┌──────────┐   ┌──────────┐    ┌──────────┐     ┌──────────┐    ┌──────────┐
│ IDENTITY │───▶│  FIGMA   │──▶│  ASSETS  │───▶│  DESIGN  │────▶│   CODE   │───▶│  REVIEW  │
│ DISCOVERY│    │WIREFRAME │   │Nano+Veo  │    │Gemini 3.1│     │Codex 5.3 │    │  Claude  │
│ChatGPT+  │    │  Claude  │   │  Gemini  │    │Antigravity│    │  xhigh   │    │ Opus 4.6 │
│ Gemini   │    │          │   │          │    │          │     │          │    │          │
└──────────┘    └──────────┘   └──────────┘    └──────────┘     └──────────┘    └──────────┘
```

---

## Sources (Tools Verified)

- [Gemini 3.1 Pro](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Nano Banana 2](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)
- [Google Antigravity IDE](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [GPT-5.3-Codex](https://openai.com/index/introducing-gpt-5-3-codex/)
- [Veo 3.1](https://developers.googleblog.com/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
