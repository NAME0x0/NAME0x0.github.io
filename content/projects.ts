import { z } from "zod";
import { ProjectSchema, type Project } from "@/lib/content/schema";

export const projects = z.array(ProjectSchema).parse([
  {
    slug: "ava",
    name: "AVA",
    tagline:
      "A 2B model fine-tuned to beat Llama 3.2 3B on ARC \u2014 with a 42 MB adapter on a 4 GB GPU.",
    status: "MEASURED",
    tier: 1,
    stack: ["Python", "PyTorch", "PEFT/QLoRA", "Triton", "GGUF"],
    links: {
      repo: "https://github.com/NAME0x0/AVA",
    },
    summary:
      "Research/training stack for a tool-using, memory-aware assistant targeting 4 GB VRAM (RTX A2000 laptop). 17-benchmark, 16,872-task eval harness. Custom Triton kernel work, verifier-RL, external memory, published HuggingFace adapter.",
    metrics: [
      { label: "ARC-Challenge", value: "82.0%", verified: true },
      { label: "ARC-Easy", value: "92.0%", verified: true },
      { label: "Llama 3.2 3B-Instruct baseline", value: "78.6%", verified: true },
      { label: "Adapter size", value: "42 MB", verified: true },
      { label: "GPU", value: "4 GB VRAM", verified: true },
      { label: "Eval harness", value: "17 benchmarks / 16,872 tasks", verified: true },
    ],
    chapter: 3,
    problem: "",
    constraints: "",
    architecture: "",
    warStories: [],
  },
  {
    slug: "pantheon-trades",
    name: "Pantheon-Trades",
    tagline:
      "Eleven AI agents deliberate every prediction-market trade; refusals are recorded on-chain.",
    status: "LIVE",
    tier: 1,
    stack: ["Python", "FastAPI", "Solidity", "Foundry", "Next.js"],
    links: {
      repo: "https://github.com/NAME0x0/Pantheon-Trades",
      demo: "https://pantheon-trades.vercel.app",
    },
    summary:
      "Multi-agent deliberation + calibration + on-chain accountability infrastructure on Arc Testnet / Polymarket CLOB. Half-Kelly sizing, Platt/isotonic calibration, public /methodology, /council and /counter-evidence pages, 11-provider LLM fallback chain.",
    metrics: [
      { label: "Brier score", value: "0.149 (200-market backtest)", verified: true },
      { label: "Python tests", value: "714", verified: true },
      { label: "Solidity tests", value: "65", verified: true },
      { label: "Agents", value: "11", verified: true },
    ],
    chapter: 4,
    problem: "",
    constraints: "",
    architecture: "",
    warStories: [],
    framingRules: [
      "Never describe as a trading bot",
      "Frame as deliberation + calibration + on-chain accountability infrastructure",
    ],
  },
  {
    slug: "omni",
    name: "OMNI / PERSPECTIVE v2",
    tagline: "Architecture research targeting a 1.05T-parameter sparse MoE on consumer hardware.",
    status: "SPEC / IN PROGRESS",
    tier: 1,
    stack: ["Rust"],
    links: {
      repo: "https://github.com/NAME0x0/OMNI",
    },
    summary:
      "Research + in-progress implementation TARGETING 4 GB VRAM + 32 GB RAM via layer streaming, ternary {-1,0,+1} weights, O(1) perspective-decay recurrence, top-1 routing over a 3D torus manifold (8\u00d74\u00d74 expert lattice), holographic distributed memory, safety polytope projection. Throughput figures are projected by bandwidth model, not measured.",
    metrics: [
      { label: "Tests passing", value: "243", verified: true },
      { label: "Parameters", value: "1.05T (design target)", verified: false },
      { label: "Expert lattice", value: "8\u00d74\u00d74 on 3D torus", verified: true },
    ],
    chapter: 5,
    problem: "",
    constraints: "",
    architecture: "",
    warStories: [],
    framingRules: [
      "Always 'targeting' / 'designed to', never 'runs'",
      "Persistent label: RESEARCH IN PROGRESS \u2014 projections, not measurements",
    ],
  },
  {
    slug: "agi-ledger",
    name: "AGI-Ledger",
    tagline: "A version-controlled observatory of human belief about AGI.",
    status: "LIVE",
    tier: 1,
    stack: ["TypeScript", "Next.js", "R3F/Three", "Tailwind v4", "Lenis", "Framer Motion"],
    links: {
      repo: "https://github.com/NAME0x0/AGI-Ledger",
      demo: "https://agi-ledger.vercel.app",
    },
    summary:
      'Each take is a star in a 3D belief-space. ~22 seeded takes from named AI figures. Every take answers "what would change my mind?".',
    metrics: [{ label: "Seeded takes", value: "~22", verified: true }],
    chapter: 6,
    problem: "",
    constraints: "",
    architecture: "",
    warStories: [],
  },
  {
    slug: "mald",
    name: "MALD",
    tagline:
      "Single-binary local PKM: SQLite FTS5 + HNSW hybrid search, cited RAG chat to exact file/line via Ollama.",
    status: "SHIPPED",
    tier: 2,
    stack: ["Rust"],
    links: {
      repo: "https://github.com/NAME0x0/MALD",
    },
    chapter: 1,
  },
  {
    slug: "pane",
    name: "pane",
    tagline:
      "Real Linux desktops on Windows via WSL2/XRDP from one control surface; Arch-first MVP shipped as pane.exe.",
    status: "SHIPPED (MVP)",
    tier: 2,
    stack: ["Rust"],
    links: {
      repo: "https://github.com/NAME0x0/pane",
    },
    chapter: 1,
  },
  {
    slug: "neural-nets",
    name: "neural-nets",
    tagline: "Six-chapter interactive in-browser curriculum: linear algebra \u2192 calculus \u2192 backprop.",
    status: "SHIPPED",
    tier: 2,
    stack: ["TypeScript"],
    links: {
      repo: "https://github.com/NAME0x0/neural-nets",
    },
    chapter: 3,
  },
  {
    slug: "webdesk",
    name: "WebDesk",
    tagline: "Any website, video, or shader as a live Windows wallpaper.",
    status: "SHIPPED",
    tier: 2,
    stack: ["C#/.NET 8 + WebView2"],
    links: {
      repo: "https://github.com/NAME0x0/WebDesk",
    },
    chapter: 2,
  },
  {
    slug: "mavis",
    name: "MAVIS",
    tagline: "Windows shell environment \u2014 spec phase.",
    status: "SPEC / IN PROGRESS",
    tier: 2,
    stack: ["Rust"],
    links: {
      repo: "https://github.com/NAME0x0/MAVIS",
    },
    chapter: 1,
  },
  {
    slug: "terminus",
    name: "Terminus",
    tagline: "Terminal environment for Windows \u2014 spec phase.",
    status: "SPEC / IN PROGRESS",
    tier: 2,
    stack: ["C++"],
    links: {
      repo: "https://github.com/NAME0x0/Terminus",
    },
    chapter: 1,
  },
  {
    slug: "tangled",
    name: "Tangled",
    tagline: "Quantum-entanglement-between-browser-windows toy.",
    status: "SHIPPED",
    tier: 2,
    stack: ["JavaScript"],
    links: {
      repo: "https://github.com/NAME0x0/Tangled",
    },
    chapter: 7,
  },
]) satisfies Project[];
