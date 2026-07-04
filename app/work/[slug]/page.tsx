import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetricsTable } from "@/components/site/MetricsTable";
import { ScrollFXMount } from "@/components/site/ScrollFXMount";
import { StatusBadge } from "@/components/site/StatusBadge";
import { TrackedLink } from "@/components/site/TrackedLink";
import { SceneWidget, type WidgetScene } from "@/components/widgets/SceneWidget";
import { getTierOneProjectBySlug, tierOneProjects } from "@/lib/content/projects";

type WorkDetailPageProps = {
  params: {
    slug: string;
  };
};

const linkClass =
  "text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

const sceneBySlug: Record<string, WidgetScene> = {
  ava: "bars",
  "pantheon-trades": "council",
  omni: "torus",
  "agi-ledger": "stars",
};

export function generateStaticParams() {
  return tierOneProjects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: WorkDetailPageProps): Metadata {
  const project = getTierOneProjectBySlug(params.slug);

  if (!project) {
    return {};
  }

  return {
    title: project.name,
    description: project.tagline,
  };
}

function ResearchLabel({ slug }: { slug: string }) {
  const project = getTierOneProjectBySlug(slug);
  const label = project?.framingRules?.find((rule) => rule.startsWith("Persistent label: "))?.replace(
    "Persistent label: ",
    "",
  );

  return label ? <p className="font-mono text-xs uppercase tracking-[0.16em] text-ember">{label}</p> : null;
}

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const project = getTierOneProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const links = [
    { label: "repo", href: project.links.repo },
    project.links.demo ? { label: "demo", href: project.links.demo } : null,
    project.links.adapter ? { label: "adapter", href: project.links.adapter } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <main id="main" className="px-6 py-section-y">
      <ScrollFXMount />
      <article className="mx-auto max-w-6xl space-y-12">
        <header className="max-w-[68ch] space-y-5">
          <div data-reveal="overline" data-parallax="soft">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// WORK"}</p>
            <span data-reveal-rule className="mt-3 block h-px w-24 origin-left bg-faint" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 data-reveal="lines" data-hero-lockup className="font-display text-4xl font-bold text-ink">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.slug === "omni" ? <ResearchLabel slug={project.slug} /> : null}
          <p className="text-xl text-bone">{project.tagline}</p>
          <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.12em]">
            {links.map((link) => (
              link.label === "demo" ? (
                <TrackedLink
                  key={link.href}
                  href={link.href}
                  event={{ name: "demo_clicked", properties: { slug: project.slug } }}
                  className={linkClass}
                  external
                >
                  {link.label}
                </TrackedLink>
              ) : (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              )
            ))}
          </div>
          <div data-reveal="row" className="pt-3">
            <SceneWidget scene={sceneBySlug[project.slug]} />
          </div>
        </header>

        {project.problem ? <TextSection title="Problem" body={project.problem} /> : null}
        {project.constraints ? <TextSection title="Constraints" body={project.constraints} /> : null}
        {project.architecture ? <TextSection title="Architecture" body={project.architecture} /> : null}
        {project.warStories.length > 0 ? (
          <section className="max-w-[68ch] border-t border-faint pt-8">
            <h2 data-reveal="lines" className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// WAR STORIES"}</h2>
            <ul className="space-y-3 text-dim">
              {project.warStories.map((story) => (
                <li key={story} data-reveal="row">{story}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="max-w-[68ch] border-t border-faint pt-8">
          <h2 data-reveal="lines" className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// RESULTS"}</h2>
          <MetricsTable metrics={project.metrics} />
        </section>

        <section className="max-w-[68ch] border-t border-faint pt-8">
          <h2 data-reveal="lines" className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// STACK"}</h2>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} data-reveal="row" className="border border-faint px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-dim">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

function TextSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="max-w-[68ch] border-t border-faint pt-8">
      <h2 data-reveal="lines" className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{`// ${title}`}</h2>
      <p className="text-dim">{body}</p>
    </section>
  );
}
