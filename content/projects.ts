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
      adapter: "https://huggingface.co/NAME0x0/AVA-v2",
    },
    summary:
      "Research/training stack for a tool-using, memory-aware assistant targeting 4 GB VRAM (RTX A2000 laptop). 17-benchmark, 16,872-task eval harness. Custom Triton kernel work, verifier-RL, external memory, published HuggingFace adapter.",
    metrics: [
      { label: "ARC-Challenge", value: "82.0%", verified: true },
      { label: "ARC-Easy", value: "92.0%", verified: true },
      { label: "Llama 3.2 3B-Instruct baseline", value: "78.6%", verified: true },
      { label: "MMLU 5-shot", value: "59.2%", verified: true },
      { label: "GSM8K (greedy / k=5)", value: "35.3% / 44.0%", verified: true },
      { label: "Adapter size", value: "42 MB", verified: true },
      { label: "Training peak VRAM", value: "1.81 GB", verified: true },
      { label: "Eval harness", value: "17 benchmarks / 16,872 tasks", verified: true },
    ],
    chapter: 3,
    problem:
      "Small models are assumed to need cloud clusters to be worth anything. AVA asks how much capability a 2B model can reach when the entire loop — training, evaluation, inference — must fit on a single 4 GB laptop GPU. No cloud, no cluster, no budget.",
    constraints:
      "RTX A2000 laptop with 4 GB VRAM; training peaked at 1.81 GB. Maximum 384 training tokens, so long reasoning chains were never seen in training. Windows 11 toolchain, which meant making Triton, Flash-Linear-Attention, and BitsAndBytes coexist — every workaround is published. Every number is reproducible end-to-end on the same laptop.",
    architecture:
      "A 42 MB QLoRA adapter on Qwen 3.5 2B, trained in about 100 minutes, released on HuggingFace with GGUF builds that run via Ollama. Custom Triton kernel work, verifier-RL, external memory. Evaluated on a 17-benchmark, 16,872-task harness with 95% Wilson confidence intervals. The weak spots are stated in the repo, not hidden: math, tool routing, narrative commonsense — all targeted by v3.",
    warStories: [
      "The hardest bug wasn't in the code. Training drew power faster than the charger could supply it, so runs had to stop for the laptop to recharge — and early versions had no checkpoint resume, so every pause threw away all progress. Building checkpointing turned training from an endurance contest into something manageable.",
      "Every intervention shipped at once — corpus mix, QLoRA config, base model choice. On hardware this slow, ablating one variable at a time wasn't affordable, and the laptop was also my daily machine for university. One shot, hoping for a drastic change; got one.",
      "What v2 should have had: real tool calling — the corpus had ~55 tool examples against 20K math ones, and the model invokes tools in 0.6% of agentic runs — plus YaRN to push context past the 384-token training window. Both are v3 targets.",
    ],
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
      { label: "Council Brier score", value: "0.149 (200-market backtest)", verified: true },
      { label: "Human consensus Brier (same markets)", value: "0.126", verified: true },
      { label: "Single-shot LLM Brier (same markets)", value: "0.260", verified: true },
      { label: "Python tests", value: "714", verified: true },
      { label: "Solidity tests + Halmos symbolic checks", value: "65 + 12", verified: true },
      { label: "Agents", value: "11", verified: true },
    ],
    chapter: 4,
    problem:
      "Most trading bots are a black box: they optimise one number and ask you to trust the brochure. Pantheon inverts that. The council prompts are public, the math is documented, and the refusals — not the trades — are recorded on-chain, so the discipline claim is falsifiable. Either the contract has receipts or it's empty.",
    constraints:
      "Costs $0 to try: Arc Testnet only, gas dripped free by Circle's faucet. Live Polymarket execution is blocked (the operator is geo-blocked), so every result is paper — the site says so. The constitution caps single positions at 5% of NAV and categories at 2–5%, pauses new positions for 30 days after a 50% drawdown, and an expected-value gate refuses any trade whose net-EV t-stat is below 2.0 after fees, spread, slippage, and gas.",
    architecture:
      "Thirteen Python services behind a FastAPI gateway, each with its own uv environment. The council runs four rounds — openings, challenges, Athena's synthesis, blind vote — with Zeus and Solon holding unilateral vetoes and Eris forced to argue the minority side against groupthink. Areopagus sizes accepted trades at half-Kelly and writes refused ones to an immutable Solidity contract (12 Halmos symbolic checks). Agent weights drift on realised Brier; Platt and isotonic regression recalibrate the council from outcomes. On the 200-market backtest it beats a single-shot LLM by a wide margin (0.149 vs 0.260) and does not beat the human consensus (0.126) — that comparison stays on the site on purpose.",
    warStories: [
      "The 11-provider fallback chain and the session-key/x402 wallet plumbing were both pain, but the hardest part was Arc itself — recording anything on-chain was a completely foreign concept going in. Integrating it meant learning the whole model from zero, mid-build.",
      "Built for the Agora hackathon, but the want was older: a personal risk-management system for trading. Instead of chasing a system that covers every horizon, the design collapsed to denying trades — refusal was the unique alpha, and explicit constitutional rules handed to specific agents in the debate made it actually buildable.",
      "I wouldn't unwind any of it; the lesson was the value. Starting over: better data, a live orchestrator running the full debate end-to-end, sharper per-agent system prompts, cleaner scripts. The backtest already says where the ceiling is — the room for improvement is on the record.",
    ],
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
      { label: "Active parameters per token", value: "14.95B (top-1 routing)", verified: false },
      { label: "Expert lattice", value: "8\u00d74\u00d74 on 3D torus", verified: true },
      { label: "Decode throughput", value: "~10\u201311 tok/s (bandwidth model)", verified: false },
    ],
    chapter: 5,
    problem:
      "A 1.05T-parameter model does not fit in 4 GB of VRAM and 32 GB of RAM; dense deployment fails that envelope outright. OMNI treats parameter count as a delivery-and-scheduling problem rather than a VRAM-residency problem. It is architecture research with an in-progress implementation \u2014 not a running model, and the repo says so in its own maturity table.",
    constraints:
      "The target envelope is consumer hardware: 4 GB VRAM plus 32 GB RAM, with roughly 208 GB of ternary expert weights streamed from NVMe (~253 GB with deltas). Decode throughput of ~10\u201311 tok/s is projected by a bandwidth model, not measured. The inference pipeline is intentionally fail-fast: process_token returns an error by design until the real execution path exists.",
    architecture:
      "128 ternary {-1,0,+1} experts arranged on an 8\u00d74\u00d74 lattice over a 3D torus, top-1 routed \u2014 14.95B active parameters per token out of 1.05T total. 80 layers: 60 of O(1) perspective-decay recurrence plus 20 of windowed grouped-query attention. Layer-streamed execution with double-buffered load/compute overlap, holographic distributed memory, forward-mode adaptation without backprop graph storage, and a safety polytope that hard-projects outputs into a convex safe region. 243 tests pass; the runtime is honest about what doesn't run yet.",
    warStories: [
      "Everything about it is hard, including the math. That's the cost of a path others haven't fully taken \u2014 it's still an idea, despite the engineering around it, and every step is a challenge because nobody has walked this exact route to completion.",
      "Designing for 4 GB before proving anything can train was deliberate: 4 GB is the machine I own. Ternary weights, streaming, the whole architecture \u2014 every aspect is shaped around my current hardware and current capability. The next machine will be better, and the design scales with it. It only goes up from here.",
      "What would I do differently? Nothing yet. OMNI isn't real right now \u2014 the repo says so \u2014 and I'm still learning; every step is something new. Ask again when process_token stops returning an error by design.",
    ],
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
    problem:
      "Predictions about AGI evaporate — people revise their positions silently and history loses the receipts. The Ledger seals belief in version control: every take timestamped, attributed, and immutable in git history. When AGI actually arrives, the only question that matters is answerable: who called it?",
    constraints:
      "One rule keeps the slop out: every take must answer \"what would change my mind?\" with one specific, realistic falsifier — no falsifier, no merge. Contribution deliberately requires a pull request; that friction is the cost of putting your name on the permanent record. Seeded takes from named AI figures are faithful summaries of documented views with source links, never verbatim quotes.",
    architecture:
      "Takes are structured markdown answering five axes plus a timeline and a risk percentage, validated against a public schema. The site renders them as a 3D observatory: each take a star positioned in belief-space, like-minded takes forming visible faction clusters, entered through a bust-dissolve GPU particle morph. Next.js App Router, React Three Fiber, Tailwind v4, Lenis, Framer Motion — tuned for 60fps with no postprocessing, adaptive DPR, and a render loop that pauses outside the cinematic section.",
    warStories: [
      "The bust-dissolve morph was the fight: one GPU particle system carrying a sculpted head into a cosmos of beliefs, at 60fps, with postprocessing off the table.",
      "The \"what would change my mind?\" rule was there from day one. It isn't moderation — it's the merge gate. A position without a falsifier doesn't get in.",
      "Starting over: non-git contributors come first — the web form ships before the polish — and it gets advertised everywhere. The Ledger is for the community, not for people who know YAML.",
    ],
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
