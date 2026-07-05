import { projects } from "@/content/projects";
import type { Project } from "@/lib/content/schema";

export type TierOneProject = Extract<Project, { tier: 1 }>;
export type TierTwoProject = Extract<Project, { tier: 2 }>;

export const tierOneProjects = projects.filter((project): project is TierOneProject => project.tier === 1);
export const tierTwoProjects = projects.filter((project): project is TierTwoProject => project.tier === 2);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getTierOneProjectBySlug(slug: string): TierOneProject | undefined {
  const project = getProjectBySlug(slug);
  return project?.tier === 1 ? project : undefined;
}

export function getProjectByChapter(chapter: number): Project[] {
  return projects.filter((project) => project.chapter === chapter);
}

export function getProjectRequired(slug: string): Project {
  const project = getProjectBySlug(slug);

  if (!project) {
    throw new Error(`Missing project: ${slug}`);
  }

  return project;
}
