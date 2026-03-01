import {
  curatedProjectOverrides,
  languageColors,
  SOVEREIGN_STACK,
} from "@/lib/data/curated";
import type { ProjectLayer } from "@/lib/github/types";

export interface Project {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  homepage?: string;
  topics: string[];
  layer: ProjectLayer;
  featured: boolean;
  fork?: boolean;
  updatedAt?: string;
}

const baseUrls: Record<string, string> = {
  MALD: "https://github.com/NAME0x0/MALD",
  MAVIS: "https://github.com/NAME0x0/MAVIS",
  Terminus: "https://github.com/NAME0x0/Terminus",
  AVA: "https://github.com/NAME0x0/AVA",
  SMNTC: "https://github.com/NAME0x0/SMNTC",
  Tangled: "https://github.com/NAME0x0/Tangled",
  WebDesk: "https://github.com/NAME0x0/WebDesk",
  QuickTask: "https://github.com/NAME0x0/QuickTask",
};

export const projects: Project[] = Object.entries(curatedProjectOverrides).map(
  ([name, override]) => ({
    name,
    description: override.description ?? "",
    language: override.language ?? "Unknown",
    stars: 0,
    url: baseUrls[name] ?? `https://github.com/NAME0x0/${name}`,
    homepage: override.homepage,
    topics: override.topics ?? [],
    layer: override.layer,
    featured: override.featured,
    fork: false,
  })
);

export { SOVEREIGN_STACK };

export const featuredProjects = projects.filter((project) => project.featured);
export const allProjects = projects.filter((project) => !project.fork);

export { languageColors };
