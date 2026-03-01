import { coreTools as curatedCoreTools, profileIdentity } from "@/lib/data/curated";

export const profile = {
  name: profileIdentity.name,
  alias: profileIdentity.alias,
  handle: profileIdentity.handle,
  title: profileIdentity.role,
  location: profileIdentity.location,
  university: "BSc (Hons) IT — Middlesex University Dubai",
  bio: profileIdentity.summary,
  email: profileIdentity.email,
  socials: profileIdentity.socials,
  stats: {
    publicRepos: 0,
    followers: 0,
    following: 0,
    memberSince: "2022",
  },
} as const;

export const capabilities = [
  {
    domain: "Systems Engineering",
    skills: [
      "OS and shell architecture",
      "Local-first tooling",
      "Security-first workflows",
      "Cross-language systems design",
    ],
  },
  {
    domain: "AI Engineering",
    skills: [
      "RAG pipelines",
      "LLM orchestration",
      "Inference optimization",
      "Agentic workflows",
    ],
  },
  {
    domain: "Interactive Web",
    skills: [
      "Next.js",
      "Three.js / R3F",
      "GSAP scroll systems",
      "Motion + performance tuning",
    ],
  },
] as const;

export const coreTools = [...curatedCoreTools] as const;

export const languageDistribution = [
  { name: "Rust", percentage: 28, color: "#dea584" },
  { name: "Python", percentage: 22, color: "#3572A5" },
  { name: "TypeScript", percentage: 18, color: "#3178c6" },
  { name: "C++", percentage: 12, color: "#f34b7d" },
  { name: "JavaScript", percentage: 10, color: "#f1e05a" },
  { name: "Other", percentage: 10, color: "#6e7681" },
] as const;
