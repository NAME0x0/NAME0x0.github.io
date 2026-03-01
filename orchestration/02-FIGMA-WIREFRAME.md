# Phase 1 — Figma Wireframe Specification

This document specifies the wireframe to build in Figma before any code is written.

---

## Figma Project Setup

### Frames to Create
1. **Desktop** — 1440 x 5000+ (scrollable, full page)
2. **Mobile** — 390 x 6000+ (scrollable, full page)
3. **Component Library** — detached frame for reusable elements

### Color Setup (Figma Styles)
| Style Name | Hex | Usage |
|------------|-----|-------|
| `void` | `#000000` | All backgrounds |
| `ink` | `#E8E4DE` | Primary text, borders, icons |
| `ink-dim` | `#8A8578` | Secondary text, labels |
| `ink-faint` | `#3A3832` | Dividers, grid lines, muted borders |
| `accent` | `#C4B5A0` | Warm hover/active accent |
| `glass-stroke` | `#E8E4DE15` | Card borders (very subtle) |
| `glass-fill` | `#E8E4DE08` | Card backgrounds (near-invisible) |

### Typography Setup (Figma Text Styles)
| Style | Font | Weight | Size | Tracking |
|-------|------|--------|------|----------|
| `Display` | Space Grotesk | Bold (700) | 72 / 48 (mobile) | -0.02em |
| `H1` | Space Grotesk | SemiBold (600) | 36 / 28 (mobile) | -0.01em |
| `H2` | Space Grotesk | SemiBold (600) | 24 / 20 (mobile) | -0.01em |
| `Overline` | Geist Mono | Regular (400) | 12 / 11 (mobile) | 0.12em, uppercase |
| `Body` | Manrope | Regular (400) | 16 / 15 (mobile) | 0 |
| `Body Small` | Manrope | Regular (400) | 14 / 13 (mobile) | 0 |
| `Code` | Geist Mono | Regular (400) | 13 / 12 (mobile) | 0 |

---

## Section-by-Section Wireframe

### SECTION 0: // INIT — HERO (100vh)

```
Desktop (1440px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                                                              │
│                    ╭─ ASCII DOT-MATRIX ─╮                    │
│                    │                    │                    │
│                    │   ✋ ─── gap ─── 🤖  │                    │
│                    │  (Creation of Adam  │                    │
│                    │   hands, stippled)  │                    │
│                    ╰────────────────────╯                    │
│                                                              │
│               MUHAMMAD AFSAH MUMTAZ                          │
│              [Display, centered, off-white]                   │
│                                                              │
│       SYSTEMS ARCHITECT · AI ENGINEER · OS DEVELOPER          │
│              [Overline, centered, ink-dim]                    │
│                                                              │
│                                                              │
│                         ↓                                    │
│                    [scroll cue]                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Mobile (390px):
┌────────────────────────┐
│                        │
│                        │
│   ╭── ASCII HANDS ──╮  │
│   │   (smaller,      │  │
│   │    centered)     │  │
│   ╰──────────────────╯  │
│                        │
│  MUHAMMAD AFSAH        │
│  MUMTAZ                │
│  [Display, 48px]       │
│                        │
│  Systems Architect ·   │
│  AI Engineer ·         │
│  OS Developer          │
│  [Overline, ink-dim]   │
│                        │
│         ↓              │
│                        │
└────────────────────────┘
```

**Wireframe Notes:**
- Background: pure black (#000000)
- ASCII hands are the centrepiece — roughly 600px wide on desktop, 300px on mobile
- Hands rendered in dot-matrix stipple style (off-white dots on black)
- Gap between hands should be ~40px — representing the "interface" layer
- Name appears below the hands
- Subtle particle drift behind the hands (note as annotation, not drawn)
- Scroll cue: thin animated line or chevron

**Animation Annotations (add as Figma comments):**
- Hands animate from separated (off-screen) to almost-touching on load (2s ease)
- Name fades in after hands reach position (0.3s delay)
- Role text fades in after name (0.2s delay)
- On scroll: hands very slowly drift apart (parallax, 0.1x scroll speed)
- Particle field has continuous slow drift

---

### SECTION 1: // ARCHITECTURE — SOVEREIGN STACK (auto height, min 100vh)

```
Desktop (1440px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  THE STACK                                                   │
│  [H1, left-aligned, off-white]                               │
│                                                              │
│  Building from bare metal to browser.                        │
│  [Body, ink-dim]                                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 01  FOUNDATION                    Rust · Linux · LUKS   │ │
│  │     Secure local-first systems and dependable           │ │
│  │     execution layers.                                   │ │
│  │     ─────────────────────────────────────────────────── │ │
│  │ 02  INTERFACE                   C++ · Rust · Lua · CMake│ │
│  │     Terminal-centric environments and shell             │ │
│  │     ergonomics.                                         │ │
│  │     ─────────────────────────────────────────────────── │ │
│  │ 03  INTELLIGENCE            Python · TypeScript · RAG   │ │
│  │     Agentic and retrieval-assisted AI systems that      │ │
│  │     stay local by default.                              │ │
│  │     ─────────────────────────────────────────────────── │ │
│  │ 04  VISUALIZATION        Three.js · WebGL · GLSL       │ │
│  │     Interactive 3D systems and motion-driven visual     │ │
│  │     communication.                                      │ │
│  │     ─────────────────────────────────────────────────── │ │
│  │ 05  TOOLS               PowerShell · CI/CD · Desktop   │ │
│  │     Automation and operator workflows.                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Mobile (390px):
┌────────────────────────┐
│                        │
│ THE STACK              │
│ [H1]                   │
│                        │
│ Building from bare     │
│ metal to browser.      │
│                        │
│ ┌────────────────────┐ │
│ │ 01 FOUNDATION      │ │
│ │ Rust · Linux       │ │
│ │ Description...     │ │
│ ├────────────────────┤ │
│ │ 02 INTERFACE       │ │
│ │ C++ · Rust · Lua   │ │
│ │ Description...     │ │
│ ├────────────────────┤ │
│ │ ...                │ │
│ └────────────────────┘ │
│                        │
└────────────────────────┘
```

**Wireframe Notes:**
- Each layer is a horizontal row with a faint bottom border (ink-faint)
- Layer number in Geist Mono (overline style, ink-dim)
- Layer name in H2, off-white
- Tech tags right-aligned on desktop, below name on mobile (Code style, ink-dim)
- Description in Body Small, ink-dim
- No cards — just clean typographic rows separated by thin lines
- Background: subtle dot-matrix grid pattern (annotate, don't draw)

**Animation Annotations:**
- Each layer slides in from left on scroll entry (staggered 0.1s each)
- Layer numbers count up as they enter
- Faint horizontal lines draw from left to right

---

### SECTION 2: // DEPLOYMENTS — PROJECTS (auto height)

```
Desktop (1440px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  WORK                                                        │
│  [H1, left-aligned, off-white]                               │
│                                                              │
│  ALL  FOUNDATION  INTERFACE  INTELLIGENCE  VISUALIZATION     │
│  [Overline tabs, horizontal, ink-dim, active = ink]          │
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │ MALD                     │  │ MAVIS                    │  │
│  │ [H2, off-white]          │  │ [H2, off-white]          │  │
│  │                          │  │                          │  │
│  │ Terminal-first PKM with  │  │ Rust-native shell        │  │
│  │ local AI retrieval...    │  │ replacement that merges  │  │
│  │ [Body Small, ink-dim]    │  │ terminal, file explorer  │  │
│  │                          │  │ [Body Small, ink-dim]    │  │
│  │ rust · local-ai · rag   │  │ rust · windows-shell     │  │
│  │ [Code, ink-faint]        │  │ [Code, ink-faint]        │  │
│  │                          │  │                          │  │
│  │ ★ Featured  → GitHub    │  │ ★ Featured  → GitHub    │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │ TERMINUS                 │  │ AVA                      │  │
│  │ ...                      │  │ ...                      │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │ SMNTC                    │  │ TANGLED                  │  │
│  │ ...                      │  │ ...                      │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Mobile (390px):
┌────────────────────────┐
│                        │
│ WORK                   │
│                        │
│ ALL FOUND. INT. INTEL. │
│ [Horizontal scroll]    │
│                        │
│ ┌────────────────────┐ │
│ │ MALD               │ │
│ │ Description...     │ │
│ │ tags               │ │
│ │ ★  →               │ │
│ └────────────────────┘ │
│                        │
│ ┌────────────────────┐ │
│ │ MAVIS              │ │
│ │ ...                │ │
│ └────────────────────┘ │
│                        │
│ ...                    │
└────────────────────────┘
```

**Wireframe Notes:**
- Cards have glass-stroke border (1px, #E8E4DE15) and glass-fill background
- No heavy shadows — cards should barely distinguish from the void
- 2-column grid on desktop, 1-column on mobile
- 24px gap between cards
- Project name is the dominant element (H2, off-white)
- Tags are in Code style, muted
- GitHub link arrow (→) right-aligned in card footer
- Filter tabs are text-only, no backgrounds, active state is brighter text + underline

**Animation Annotations:**
- Cards fade in and slide up on scroll entry (staggered by row)
- On hover: card border brightens slightly, 2px translate-y lift
- Filter change: cards animate out/in with cross-fade
- Background: very subtle, slow particle drift (same system as hero, just sparser)

---

### SECTION 3: // IDENTITY — ABOUT (auto height)

```
Desktop (1440px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ABOUT                                                       │
│  [H1, left-aligned, off-white]                               │
│                                                              │
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │                         │  │                            │ │
│  │  I design sovereign     │  │  GITHUB STATS              │ │
│  │  computing systems      │  │  [Overline]                │ │
│  │  across operating       │  │                            │ │
│  │  environments, AI       │  │  Repos: XX                 │ │
│  │  workflows, and         │  │  Contributions: XX         │ │
│  │  immersive interfaces.  │  │  Stars: XX                 │ │
│  │  [Body, off-white]      │  │  [Code, off-white]         │ │
│  │                         │  │                            │ │
│  │  CAPABILITIES           │  │  LANGUAGES                 │ │
│  │  [Overline]             │  │  [Overline]                │ │
│  │                         │  │                            │ │
│  │  · Systems Engineering  │  │  ████████████░ Rust 28%    │ │
│  │  · AI Engineering       │  │  █████████░░░ Python 22%   │ │
│  │  · Interactive Web      │  │  ███████░░░░ TS 18%        │ │
│  │  [Body Small, ink-dim]  │  │  █████░░░░░░ C++ 12%      │ │
│  │                         │  │  ████░░░░░░░ JS 10%        │ │
│  │  Dubai, UAE             │  │  [Bar chart, inline]       │ │
│  │  BSc (Hons) IT          │  │                            │ │
│  │  Middlesex University   │  │                            │ │
│  │                         │  │                            │ │
│  └─────────────────────────┘  └────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Mobile (390px):
┌────────────────────────┐
│                        │
│ ABOUT                  │
│                        │
│ Bio text...            │
│                        │
│ CAPABILITIES           │
│ · Systems Engineering  │
│ · AI Engineering       │
│ · Interactive Web      │
│                        │
│ GITHUB STATS           │
│ Repos: XX              │
│ ...                    │
│                        │
│ LANGUAGES              │
│ Bar chart...           │
│                        │
└────────────────────────┘
```

**Wireframe Notes:**
- Two-column layout on desktop (60/40 split), single column on mobile
- No card borders — content floats directly on the void
- Language bars are simple horizontal bars in off-white, varying width
- Stats are in a grid: 2x2 on desktop, 2x2 on mobile
- Background: slow-drifting dot-matrix field (very sparse, annotate)

**Animation Annotations:**
- Left column slides in from left, right from right (on scroll entry)
- Language bars animate width from 0 to target (staggered)
- Stats numbers count up from 0

---

### SECTION 4: // UPLINK — CONTACT (50vh min)

```
Desktop (1440px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                      LET'S BUILD                             │
│                    [H1, centered, off-white]                  │
│                                                              │
│                  m.afsah.279@gmail.com                        │
│                  [Body, centered, accent, underline]          │
│                                                              │
│                  GitHub · LinkedIn · Twitter                  │
│                  [Code, centered, ink-dim, spaced]            │
│                                                              │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│                  © 2026 Muhammad Afsah Mumtaz                 │
│                  [Code, centered, ink-faint]                  │
│                                                              │
│  ╭─ faded ASCII hands motif (callback to hero) ─╮           │
│  │  (very low opacity, cropped, decorative)      │           │
│  ╰───────────────────────────────────────────────╯           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Wireframe Notes:**
- Minimal, centered layout
- Email is clickable (mailto: link)
- Social links are text, not icons (fits terminal aesthetic)
- Thin horizontal rule (ink-faint) separates content from copyright
- Faded ASCII hands at very low opacity (5-10%) as a background callback

**Animation Annotations:**
- Heading and email fade in on scroll entry
- Social links stagger in after email
- Faded hands in background have very slow continuous parallax drift

---

## Global Elements

### Navigation (Fixed, minimal)

```
Desktop:
┌──────────────────────────────────────────────────────────────┐
│  NAME0x0                    STACK  WORK  ABOUT  CONTACT      │
│  [Code, ink-dim]            [Overline, ink-dim, right]       │
└──────────────────────────────────────────────────────────────┘

Mobile:
┌────────────────────────┐
│  NAME0x0          ☰    │
│  [Code]         [menu] │
└────────────────────────┘
```

- Fixed at top, transparent background
- Appears after scrolling past hero (opacity transition)
- Active section is highlighted in off-white
- Mobile: hamburger menu opens full-screen overlay on black

### Scroll Progress Bar

```
┌──────────────────────────────────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────────┘
```

- 2px thin line at very top of viewport
- Off-white fill, ink-faint track
- Scales with scroll position

---

## Figma Deliverables Checklist

- [ ] Desktop wireframe (1440px, full scroll)
- [ ] Mobile wireframe (390px, full scroll)
- [ ] Component library frame (cards, buttons, nav, tabs)
- [ ] Color styles registered
- [ ] Text styles registered
- [ ] Animation annotations on each section (Figma comments)
- [ ] ASCII hands placement and scale defined
- [ ] Responsive breakpoint notes (1440, 1024, 768, 390)
- [ ] Export frame for sharing with Gemini and Codex teams
