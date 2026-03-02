"use client";

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
  const resolvedLanguage = language?.trim() || "Unknown";
  const resolvedLanguageColor = languageColor || "#6e7681";
  const topicLabel = topics.length > 0 ? topics.join(" \u00B7 ") : "No topics";

  return (
    <article
      className={`project-card group glass-card flex flex-col gap-3 p-6 ${featured ? "glass-card--featured" : ""}`}
      data-project-card
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-ink">{name}</h3>
        {featured ? (
          <span className="rounded border border-accent/30 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            Featured
          </span>
        ) : null}
      </div>

      <p className="line-clamp-3 text-sm text-ink-dim">{description}</p>

      <p className="truncate font-mono text-sm text-ink-faint transition-colors duration-300 group-hover:text-ink-dim group-focus-within:text-ink-dim">
        {topicLabel}
      </p>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="flex items-center gap-2 font-mono text-sm text-ink-dim">
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
            aria-label={`Open ${name} repository on GitHub`}
            className="group inline-flex min-h-11 items-center px-2 font-mono text-sm text-ink-dim transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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
    </article>
  );
}

export default ProjectCard;
