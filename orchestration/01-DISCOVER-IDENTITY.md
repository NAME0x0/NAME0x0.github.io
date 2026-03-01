# Phase 0 — Identity Discovery Prompts

These prompts are designed to be pasted directly into **ChatGPT** and **Gemini** (separate conversations) to get each AI's perspective on who Muhammad Afsah Mumtaz is. The responses will inform the design personality of the portfolio.

---

## Context to Provide Both AIs

Before the main prompt, paste this context block so the AI has ground truth:

```
CONTEXT — Muhammad Afsah Mumtaz (Afsah)

GitHub: https://github.com/NAME0x0
Handle: NAME0x0
Location: Dubai, UAE
University: BSc (Hons) IT — Middlesex University Dubai
Role: Systems Architect · AI Engineer · OS Developer

Summary: "I design sovereign computing systems across operating environments,
AI workflows, and immersive interfaces."

Key Projects:
- MALD: Terminal-first personal knowledge management with local AI retrieval
  and citation-backed answers, shipped as a single Rust binary.
- MAVIS: Rust-native shell replacement merging terminal, file exploration,
  and system control.
- Terminus: Desktop-replacing C++ terminal environment for keyboard-first workflow.
- AVA: Local-first personal assistant with retrieval pipelines and controllable
  orchestration (Python).
- SMNTC: Semantic motion and topography engine abstracting WebGL behavior
  into intent-level tokens (TypeScript).
- Tangled: Synchronized WebGL scenes shared across browser contexts.
- WebDesk: Desktop wallpaper runtime executing local web experiences with
  live interactivity (Python).
- QuickTask: Offline CLI planner converting natural language into structured
  tasks with local models.

Language Distribution: Rust 28%, Python 22%, TypeScript 18%, C++ 12%,
JavaScript 10%, Other 10%

Core Tools: Rust, C++, Python, TypeScript, Three.js, GSAP, CUDA, Docker,
CMake, FastAPI, Ollama, GitHub Actions

Philosophy: Local-first, security-first, terminal-centric, sovereign computing.
Builds across the full stack from OS kernel to WebGL visualization.

Sovereign Stack Layers:
1. Foundation — Rust, Linux, LUKS, s6
2. Interface — C++, Rust, Lua, CMake
3. Intelligence — Python, TypeScript, RAG, LLM orchestration
4. Visualization — Three.js, WebGL, GLSL, Next.js
5. Tools — PowerShell, CI/CD, Desktop tooling
```

---

## Prompt for ChatGPT

Paste the context block above, then this prompt:

```
Based on the context above, I need you to write a detailed personality brief
about Muhammad Afsah Mumtaz (Afsah). This brief will be used by a design team
to create his personal portfolio website. I need you to cover:

1. PERSONALITY ARCHETYPE
   - What kind of developer/person does this profile suggest?
   - What drives someone who builds at this depth (OS-level to WebGL)?
   - What psychological type or archetype fits? (e.g., "The Architect",
     "The Sovereign Builder", etc.)

2. AESTHETIC SENSIBILITY
   - Based on the projects and tools, what visual language would resonate?
   - What design references from outside tech might fit? (architecture,
     film, art, fashion, music)
   - What color palettes, textures, and moods align with this person?

3. VALUES & PHILOSOPHY
   - What values can you infer? (sovereignty, privacy, craftsmanship,
     independence, depth over breadth?)
   - How does the "local-first" and "sovereign computing" philosophy
     translate into visual design?

4. BRAND VOICE
   - How should this person's website speak? (authoritative? minimal?
     poetic? technical? cryptic?)
   - What tone should the copy take?
   - What would the tagline or manifesto sound like?

5. CULTURAL REFERENCES
   - What movies, games, music, or art movements share this aesthetic?
   - Think: Blade Runner, Ghost in the Shell, Brutalist architecture,
     Dieter Rams, etc. — what fits?

6. ANTI-PATTERNS
   - What should the portfolio absolutely NOT look like?
   - What common portfolio cliches should be avoided?

Write this as a design brief document, not a conversation. Be specific
and opinionated. This will directly inform visual design decisions.
```

---

## Prompt for Gemini 3.1 Pro

Paste the context block above, then this prompt:

```
You are a senior creative director at a Web3 design studio. Based on the
context above, create a comprehensive identity profile for Muhammad Afsah
Mumtaz (Afsah) that will guide the redesign of his personal portfolio
website. The new site will use:

- Pure black (#000000) background
- Off-white (#E8E4DE) primary text
- WebGL shaders and Three.js for all visual elements
- An animated ASCII dot-matrix rendering of Michelangelo's "Creation of
  Adam" hands as the hero centrepiece
- Web3 glass-morphism UI patterns

I need you to cover:

1. WHO IS THIS PERSON?
   Analyze the GitHub profile, projects, and tech choices. What kind of
   mind builds MALD (a Rust PKM), MAVIS (a shell replacement), Terminus
   (a desktop-replacing terminal), and AVA (a local AI assistant)?
   What does this say about their worldview?

2. DESIGN PERSONALITY
   If this person were a design language, what would they be?
   Think in terms of:
   - Architecture (Brutalist? Parametric? Japanese minimalism?)
   - Film (Blade Runner? Tron? Ghost in the Shell? Arrival?)
   - Music (what genre is this person's work?)
   - Art movement (what art period resonates?)

3. THE "CREATION OF ADAM" MOTIF
   We're using Michelangelo's hands reaching toward each other, but
   rendered in ASCII dot-matrix stippling. Interpret this symbolism:
   - Left hand = the human developer
   - Right hand = the machine/AI
   - The gap between = the interface layer this person builds
   How should this motif be animated? What emotion should it convey?

4. WEB3 VISUAL LANGUAGE
   How should Web3 aesthetics be applied without looking like a crypto
   landing page? Think:
   - Glass cards floating in void
   - Procedural shader backgrounds (not static images)
   - Monospace typography mixed with refined sans-serif
   - Grid systems that feel like terminal output
   - Subtle glow and particle effects

5. CONTENT STRATEGY
   What sections should the portfolio have? What should the copy
   tone be? How should projects be presented — as case studies,
   as a curated gallery, as a terminal log?

6. WHAT TO AVOID
   List specific anti-patterns for this person's portfolio:
   - Things that would feel inauthentic
   - Overused Web3 cliches (rainbow gradients, ape imagery, etc.)
   - Generic portfolio patterns that don't fit this identity

Be specific, opinionated, and visual. Reference real design examples
where possible. This brief will be shared with the implementation team.
```

---

## How to Use the Responses

1. **Paste the context block + prompt into ChatGPT** → Save the response as `identity-chatgpt.md`
2. **Paste the context block + prompt into Gemini 3.1 Pro** → Save the response as `identity-gemini.md`
3. **Bring both responses back to Claude** with the instruction:

```
Here are two identity briefs about me from ChatGPT and Gemini.
Synthesize them into a unified design persona that will guide
the portfolio redesign. Resolve any conflicts by choosing the
more opinionated take. Output as a structured design persona
document.
```

4. Claude (me) will create the final `DESIGN-PERSONA.md` that feeds into every subsequent phase.

---

## Quick Self-Description Prompt

If you also want to describe yourself in your own words, use this template to fill in and share with both AIs (and with me):

```
SELF-DESCRIPTION (fill in)

I would describe myself as: creative, forward-thinking, rebellious, experimental, efficient, lazy, and gifted
The kind of work that excites me most: building things that push the boundaries of what's possible, especially in the realm of AI. I like building things that are both beautiful and functional, and I'm not afraid to take risks to achieve my goals. I like thinking about new projects without even completing the previous ones.
Music I listen to while coding: Pop, R&B, Lo-fi, Classical
Movies/shows/games that resonate with me: Trackmania with the endless room for improvement aspect of it
If my ideal workspace were a place, it would look like: a futuristic room with multiple computers and screens, all displaying different things, with a comfortable chair and a good view.
The feeling I want my portfolio to give visitors: A sense of awe and wonder, like they're looking at something truly special.
Three words that describe my aesthetic: Minimalistic, futuristic, and functional.
Something I absolutely hate in web design: Overly complicated or extremely basic and cluttered interfaces that are difficult to navigate.
A website I think is beautifully designed: none really, they're all pretty basic.
The one project I'm most proud of and why: SMNTC and OMNI along with AVA.
