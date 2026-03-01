"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  curatedFlagshipOrder,
  curatedProjectOverrides,
  languageColors,
} from "@/lib/data/curated";
import { useGitHubPortfolioData } from "@/lib/hooks/useGitHubPortfolioData";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ProjectCard, type ProjectCardProps } from "@/components/ui/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const FILTER_CATEGORIES = [
  "ALL",
  "FOUNDATION",
  "INTERFACE",
  "INTELLIGENCE",
  "VISUALIZATION",
  "TOOLS",
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];
type LayerFilter = Exclude<ProjectCardProps["layer"], "other">;

const filterLayerMap: Record<FilterCategory, LayerFilter | null> = {
  ALL: null,
  FOUNDATION: "foundation",
  INTERFACE: "interface",
  INTELLIGENCE: "intelligence",
  VISUALIZATION: "visualization",
  TOOLS: "tools",
};

interface ProjectCardViewModel extends ProjectCardProps {
  sourceIndex: number;
}

function isFilterCategory(value: string): value is FilterCategory {
  return FILTER_CATEGORIES.includes(value as FilterCategory);
}

export function Projects() {
  const { data } = useGitHubPortfolioData();
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const filterTransitionCtxRef = useRef<gsap.Context | null>(null);
  const shouldAnimateFilterInRef = useRef(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  const projects = useMemo(() => {
    const repositories = data?.repositories ?? [];
    const orderIndex = new Map(
      curatedFlagshipOrder.map((name, index) => [name.toLowerCase(), index])
    );

    const mergedProjects = repositories.map((repo, sourceIndex) => {
      const override = curatedProjectOverrides[repo.name];
      const language = override?.language ?? repo.language ?? "Unknown";
      const topics = [...new Set([...(repo.topics ?? []), ...(override?.topics ?? [])])];

      return {
        name: repo.name,
        description: (override?.description ?? repo.description ?? "No description provided.").trim(),
        layer: override?.layer ?? repo.layer,
        topics,
        language,
        languageColor: languageColors[language] ?? languageColors.Unknown,
        repoUrl: repo.url,
        featured: override?.featured ?? repo.featured,
        sourceIndex,
      } satisfies ProjectCardViewModel;
    });

    mergedProjects.sort((a, b) => {
      const aOrder = orderIndex.get(a.name.toLowerCase());
      const bOrder = orderIndex.get(b.name.toLowerCase());

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }

      if (aOrder !== undefined) {
        return -1;
      }

      if (bOrder !== undefined) {
        return 1;
      }

      return a.sourceIndex - b.sourceIndex;
    });

    return mergedProjects;
  }, [data]);

  const filteredProjects = useMemo(() => {
    const layer = filterLayerMap[activeFilter];

    if (!layer) {
      return projects;
    }

    return projects.filter((project) => project.layer === layer);
  }, [activeFilter, projects]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const gridEl = gridRef.current;

    if (!sectionEl || !gridEl || projects.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gridEl.querySelectorAll<HTMLElement>("[data-project-card]");

      if (cards.length === 0) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { opacity: 1, y: 0, rotateX: 0 });
        return;
      }

      gsap.from(cards, {
        y: 30,
        opacity: 0,
        rotateX: 1,
        stagger: { each: 0.1, from: "start" },
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridEl,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, [projects.length]);

  useEffect(() => {
    return () => {
      filterTransitionCtxRef.current?.revert();
      filterTransitionCtxRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const gridEl = gridRef.current;

    if (!sectionEl || !gridEl || !shouldAnimateFilterInRef.current) {
      return;
    }

    shouldAnimateFilterInRef.current = false;

    const ctx = gsap.context(() => {
      const cards = gridEl.querySelectorAll<HTMLElement>("[data-project-card]");

      if (cards.length === 0) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }, sectionEl);

    return () => ctx.revert();
  }, [activeFilter, filteredProjects.length]);

  const handleFilterChange = (category: string) => {
    if (!isFilterCategory(category) || category === activeFilter) {
      return;
    }

    const sectionEl = sectionRef.current;
    const gridEl = gridRef.current;

    if (!sectionEl || !gridEl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shouldAnimateFilterInRef.current = false;
      setActiveFilter(category);
      return;
    }

    filterTransitionCtxRef.current?.revert();

    filterTransitionCtxRef.current = gsap.context(() => {
      const cards = gridEl.querySelectorAll<HTMLElement>("[data-project-card]");

      if (cards.length === 0) {
        shouldAnimateFilterInRef.current = false;
        setActiveFilter(category);
        filterTransitionCtxRef.current = null;
        return;
      }

      gsap.to(cards, {
        opacity: 0,
        y: 12,
        stagger: 0.04,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          shouldAnimateFilterInRef.current = true;
          setActiveFilter(category);
          filterTransitionCtxRef.current = null;
        },
      });
    }, sectionEl);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10 py-[clamp(80px,7.6vw+50px,160px)]"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-16">
        <p className="terminal-cursor mb-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
          // DEPLOYMENTS
        </p>
        <h2 id="projects-heading" className="mb-8 font-heading text-3xl font-semibold text-ink">
          WORK
        </h2>

        <div className="mb-8">
          <FilterTabs
            categories={FILTER_CATEGORIES}
            active={activeFilter}
            onChange={handleFilterChange}
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              layer={project.layer}
              topics={project.topics}
              language={project.language}
              languageColor={project.languageColor}
              repoUrl={project.repoUrl}
              featured={project.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
