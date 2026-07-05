import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { StatusBadge } from "@/components/site/StatusBadge";
import { TrackedLink } from "@/components/site/TrackedLink";
import { tierOneProjects, tierTwoProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Work",
};

const linkClass =
  "text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

export default function WorkPage() {
  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl space-y-16">
        <section>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// WORK"}</p>
          <h1 className="max-w-[68ch] font-display text-4xl font-bold text-ink">Work</h1>
        </section>

        <section className="grid auto-rows-fr gap-6 lg:grid-cols-2">
          {tierOneProjects.map((project) => (
            <SpotlightCard key={project.slug} className="flex min-h-full flex-col justify-between p-6">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="font-display text-2xl font-bold text-ink"
                    style={{ viewTransitionName: `cs-${project.slug}` } as CSSProperties}
                  >
                    {project.name}
                  </h2>
                  <StatusBadge status={project.status} />
                </div>
                <p className="line-clamp-2 text-bone">{project.tagline}</p>
                <div className="grid gap-3 border-t border-faint pt-4">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label} className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-dim">{metric.label}</span>
                      <span className={`font-mono ${metric.verified ? "text-signal" : "text-dim"}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <TrackedLink
                href={`/work/${project.slug}`}
                event={{ name: "case_study_opened", properties: { slug: project.slug } }}
                className={`mt-8 ${linkClass}`}
              >
                /work/{project.slug}
              </TrackedLink>
            </SpotlightCard>
          ))}
        </section>

        <section>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// MORE"}</p>
          <div className="space-y-0">
            {tierTwoProjects.map((project) => (
              <article key={project.slug} className="grid min-h-[5.5rem] gap-3 border-t border-faint py-5 md:grid-cols-[minmax(10rem,14rem)_auto_1fr_auto] md:items-baseline">
                <h2 className="font-display text-xl font-bold text-ink">{project.name}</h2>
                <StatusBadge status={project.status} />
                <p className="line-clamp-2 text-dim">{project.tagline}</p>
                <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  repo
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
