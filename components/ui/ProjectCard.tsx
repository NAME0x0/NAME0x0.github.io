"use client";

import { useState } from "react";

export interface ProjectCardProps {
  name: string;
  description: string;
  layer: "foundation" | "interface" | "intelligence" | "visualization" | "tools" | "other";
  topics: string[];
  language?: string;
  languageColor?: string;
  repoUrl?: string;
  featured?: boolean;
}

export function ProjectCard({
  name,
  description,
  topics,
  language,
  languageColor,
  repoUrl,
  featured,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const resolvedLanguage = language?.trim() || "Unknown";
  const resolvedLanguageColor = languageColor || "#6e7681";
  const topicLabel = topics.length > 0 ? topics.join(" \u00B7 ") : "No topics";
  const cardStyle = {
    transition:
      "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
    boxShadow: isHovered
      ? "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(232,228,222,0.05)"
      : "none",
  };

  return (
    <div
      className={`glass-card flex flex-col gap-3 p-6 ${featured ? "glass-card--featured" : ""}`}
      data-project-card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-ink">{name}</h3>
        {featured ? (
          <span className="rounded border border-accent/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
            Featured
          </span>
        ) : null}
      </div>

      <p className="line-clamp-3 text-sm text-ink-dim">{description}</p>

      <p
        className={`truncate font-mono text-sm transition-colors duration-300 ${
          isHovered ? "text-ink-dim" : "text-ink-faint"
        }`}
      >
        {topicLabel}
      </p>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="flex items-center gap-1.5 font-mono text-sm text-ink-dim">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ background: resolvedLanguageColor }}
          />
          {resolvedLanguage}
        </span>

        {repoUrl ? (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center font-mono text-sm text-ink-dim transition-colors duration-200 hover:text-ink"
          >
            GitHub
            <span
              aria-hidden="true"
              className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectCard;

