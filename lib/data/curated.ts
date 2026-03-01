import type { CuratedProjectOverrides, ProjectLayer } from "@/lib/github/types";

export const GITHUB_USERNAME = "NAME0x0";

export const profileIdentity = {
  name: "Muhammad Afsah Mumtaz",
  alias: "AFSAH",
  handle: "NAME0x0",
  role: "Systems Architect · AI Engineer · OS Developer",
  location: "Dubai, UAE",
  email: "m.afsah.279@gmail.com",
  summary:
    "I design sovereign computing systems across operating environments, AI workflows, and immersive interfaces.",
  socials: {
    github: "https://github.com/NAME0x0",
    linkedin: "https://www.linkedin.com/in/muhammad-afsah-mumtaz/",
    twitter: "https://twitter.com/NAME0X0_0",
  },
} as const;

export const languageColors: Record<string, string> = {
  Rust: "#dea584",
  "C++": "#f34b7d",
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Batchfile: "#C1F12E",
  PowerShell: "#012456",
  Shell: "#89e051",
  Lua: "#000080",
  GLSL: "#5686a5",
  Unknown: "#6e7681",
};

export const coreTools = [
  "Rust",
  "C++",
  "Python",
  "TypeScript",
  "Three.js",
  "GSAP",
  "CUDA",
  "Docker",
  "CMake",
  "FastAPI",
  "Ollama",
  "GitHub Actions",
] as const;

export const SOVEREIGN_STACK: {
  layer: ProjectLayer;
  label: string;
  description: string;
  tech: string;
}[] = [
  {
    layer: "foundation",
    label: "Foundation",
    description: "Secure local-first systems and dependable execution layers.",
    tech: "Rust · Linux · LUKS · s6",
  },
  {
    layer: "interface",
    label: "Interface",
    description: "Terminal-centric environments and shell ergonomics.",
    tech: "C++ · Rust · Lua · CMake",
  },
  {
    layer: "intelligence",
    label: "Intelligence",
    description: "Agentic and retrieval-assisted AI systems that stay local by default.",
    tech: "Python · TypeScript · RAG · LLM orchestration",
  },
  {
    layer: "visualization",
    label: "Visualization",
    description: "Interactive 3D systems and motion-driven visual communication.",
    tech: "Three.js · WebGL · GLSL · Next.js",
  },
  {
    layer: "tools",
    label: "Tools",
    description: "Automation and operator workflows that improve delivery speed.",
    tech: "PowerShell · CI/CD · Desktop tooling",
  },
];

export const curatedFlagshipOrder = [
  "OMNI",
  "SMNTC",
  "AVA",
  "MALD",
  "MAVIS",
  "Terminus",
  "Tangled",
  "WebDesk",
  "QuickTask",
] as const;

export const curatedProjectOverrides: CuratedProjectOverrides = {
  OMNI: {
    layer: "intelligence",
    featured: true,
    description:
      "Sparse Mixture-of-Experts 1.05T parameter language model engineered for 4 GB VRAM execution via layer streaming, ternary inference, and geometry-based routing.",
    topics: ["rust", "llm", "sparse-moe", "ternary-inference", "local-ai", "agi-architecture"],
  },
  MALD: {
    layer: "foundation",
    featured: true,
    description:
      "Terminal-first PKM with local AI retrieval and citation-backed answers, shipped as a single binary.",
    topics: ["rust", "local-ai", "rag", "terminal", "semantic-search"],
  },
  MAVIS: {
    layer: "interface",
    featured: true,
    description:
      "Rust-native shell replacement that merges terminal, file exploration, and system control.",
    topics: ["rust", "windows-shell", "desktop-environment", "lua"],
  },
  Terminus: {
    layer: "interface",
    featured: true,
    description:
      "Desktop-replacing terminal environment engineered for a keyboard-first workflow.",
    topics: ["c++", "terminal", "desktop"],
  },
  AVA: {
    layer: "intelligence",
    featured: true,
    description:
      "Local-first personal assistant with retrieval pipelines and controllable orchestration.",
    topics: ["python", "assistant", "llm", "ollama", "automation"],
  },
  SMNTC: {
    layer: "visualization",
    featured: true,
    description:
      "Semantic motion and topography engine that abstracts WebGL behavior into intent-level tokens.",
    topics: ["typescript", "webgl", "animation", "semantic"],
  },
  Tangled: {
    layer: "visualization",
    featured: true,
    description:
      "Synchronized WebGL scenes shared across browser contexts to explore linked state.",
    topics: ["webgl", "3d", "creative-coding"],
  },
  WebDesk: {
    layer: "tools",
    featured: true,
    description:
      "Desktop wallpaper runtime that executes local web experiences with live interactivity.",
    topics: ["python", "windows", "desktop-customization"],
  },
  QuickTask: {
    layer: "intelligence",
    featured: true,
    description:
      "Offline CLI planner that converts natural language into structured tasks with local models.",
    topics: ["python", "ollama", "task-management"],
  },
};

export const layerKeywords: Record<ProjectLayer, string[]> = {
  foundation: ["kernel", "linux", "luks", "filesystem", "security", "os"],
  interface: ["terminal", "shell", "desktop", "ui", "window-manager", "lua"],
  intelligence: ["ai", "ml", "llm", "rag", "assistant", "neural"],
  visualization: ["webgl", "three", "glsl", "3d", "visual", "animation"],
  tools: ["automation", "script", "devops", "workflow", "productivity"],
  other: [],
};
