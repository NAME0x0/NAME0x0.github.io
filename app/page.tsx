import Link from "next/link";
import { identity } from "@/content/identity";
import { projects } from "@/content/projects";
import { ChapterTracker } from "@/components/site/ChapterTracker";
import { EmailLink } from "@/components/site/EmailLink";
import { ChapterRail } from "@/components/site/ChapterRail";
import { ChapterGlow } from "@/components/site/ChapterGlow";
import { GhostNumeral } from "@/components/site/GhostNumeral";
import { Konami } from "@/components/site/Konami";
import { KineticWall } from "@/components/site/KineticWall";
import { Magnetic } from "@/components/site/Magnetic";
import { Marquee } from "@/components/site/Marquee";
import { MetricsTable } from "@/components/site/MetricsTable";
import { PhotoDeck } from "@/components/site/PhotoDeck";
import { ScrollFXMount } from "@/components/site/ScrollFXMount";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Terminal } from "@/components/site/Terminal";
import { TrackedLink } from "@/components/site/TrackedLink";
import { SceneWidget } from "@/components/widgets/SceneWidget";
import { now } from "@/lib/content/now";
import { getPhotos } from "@/lib/content/photos";
import { getProjectByChapter, getProjectRequired } from "@/lib/content/projects";
import type { TierOneProject } from "@/lib/content/projects";
import type { Project } from "@/lib/content/schema";

const linkClass =
  "text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

function Overline({ children }: { children: string }) {
  return (
    <div data-reveal="overline" data-parallax="soft" className="mb-5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{children}</p>
      <span data-reveal-rule className="mt-3 block h-px w-24 origin-left bg-faint" aria-hidden="true" />
    </div>
  );
}

function ProjectRow({ project, inverted = false }: { project: Project; inverted?: boolean }) {
  const textClass = inverted ? "text-soot" : "text-ink";
  const dimClass = inverted ? "text-soot/75" : "text-dim";
  const borderClass = inverted ? "border-soot/20" : "border-faint";

  return (
    <div data-reveal="row" className={`grid min-h-[5.5rem] gap-3 border-t ${borderClass} py-5 md:grid-cols-[minmax(10rem,14rem)_auto_1fr_auto] md:items-baseline`}>
      <h3 className={`font-display text-xl font-bold ${textClass}`}>{project.name}</h3>
      <StatusBadge status={project.status} />
      <p className={`line-clamp-2 ${dimClass}`}>{project.tagline}</p>
      <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={inverted ? "text-soot underline decoration-soot/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone" : linkClass}>
        repo
      </a>
    </div>
  );
}

function ResearchLabel({ project }: { project: TierOneProject }) {
  const label = project.framingRules?.find((rule) => rule.startsWith("Persistent label: "))?.replace(
    "Persistent label: ",
    "",
  );

  return label ? <p className="font-mono text-xs uppercase tracking-[0.16em] text-ember">{label}</p> : null;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-soot/70">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="border-t border-soot/20 pt-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const ava = getProjectRequired("ava");
const pantheon = getProjectRequired("pantheon-trades");
const omni = getProjectRequired("omni");
const agiLedger = getProjectRequired("agi-ledger");
const neuralNets = getProjectRequired("neural-nets");
const webdesk = getProjectRequired("webdesk");
const tangled = getProjectRequired("tangled");
const chapterOneProjects = getProjectByChapter(1);
const terminalIdentity = {
  name: identity.name,
  handle: identity.handle,
  role: identity.role,
  location: identity.location,
};
const terminalProjects = projects.map(({ slug, name, status, tagline, tier, links, metrics }) => ({
  slug,
  name,
  status,
  tagline,
  tier,
  links,
  metrics,
}));
const photos = getPhotos();

export default function HomePage() {
  return (
    <main id="main">
      <ChapterTracker />
      <ChapterRail />
      <ChapterGlow />
      <Konami />
      <ScrollFXMount />
      <section id="ignition" className="relative overflow-hidden px-6 py-section-y">
        <GhostNumeral value="01" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// IDENTITY"}</Overline>
          <div className="max-w-[68ch] space-y-8">
            <h1 data-reveal="lines" data-hero-lockup className="font-display text-display font-bold text-ink">{identity.lockup}</h1>
            <p className="text-2xl text-dim">{identity.positioning}</p>
            <p className="font-mono text-sm uppercase tracking-[0.14em] text-dim">
              {identity.location} · {identity.visa}
            </p>
            <div className="flex flex-wrap gap-4">
              <Magnetic>
                <TrackedLink
                  href="/work/ava"
                  event={{ name: "case_study_opened", properties: { slug: "ava" } }}
                  className="block border border-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bone transition-colors hover:bg-bone hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
                >
                  See the proof
                </TrackedLink>
              </Magnetic>
              <Magnetic>
                <EmailLink className="block border border-faint px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-bone hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                  Start a conversation
                </EmailLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <section id="metal" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="02" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// METAL"}</Overline>
          {chapterOneProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section id="voice" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="03" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// VOICE"}</Overline>
          <p className="mb-8 max-w-[68ch] text-dim">The interface layer is where machines meet people.</p>
          <ProjectRow project={webdesk} />
          <Terminal identity={terminalIdentity} projects={terminalProjects} />
        </div>
      </section>

      <section id="mind" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="04" />
        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          <Overline>{"// PROOF"}</Overline>
          {ava.tier === 1 ? (
            <article className="grid gap-8 lg:grid-cols-[minmax(0,68ch)_minmax(18rem,30rem)] lg:items-start">
              <div className="max-w-[68ch] space-y-5">
                <h2 data-reveal="lines" className="font-display text-4xl font-bold text-ink">{ava.name}</h2>
                <p className="text-xl text-bone">{ava.tagline}</p>
                <p className="text-dim">{ava.summary}</p>
              </div>
              <div data-reveal="row" className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
                <SceneWidget scene="bars" />
              </div>
              <div className="max-w-[68ch] space-y-5 lg:col-start-1">
                <MetricsTable metrics={ava.metrics} />
                <TrackedLink
                  href="/work/ava"
                  event={{ name: "case_study_opened", properties: { slug: "ava" } }}
                  className={linkClass}
                >
                  /work/ava
                </TrackedLink>
              </div>
            </article>
          ) : null}
          <ProjectRow project={neuralNets} />
        </div>
      </section>

      <section id="council" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="05" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// COUNCIL"}</Overline>
          {pantheon.tier === 1 ? (
            <article className="grid gap-8 lg:grid-cols-[minmax(0,68ch)_minmax(18rem,30rem)] lg:items-start">
              <div className="max-w-[68ch] space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 data-reveal="lines" className="font-display text-4xl font-bold text-ink">{pantheon.name}</h2>
                  <StatusBadge status={pantheon.status} />
                </div>
                <p className="text-xl text-bone">{pantheon.tagline}</p>
                <p className="text-dim">{pantheon.summary}</p>
              </div>
              <div data-reveal="row" className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
                <SceneWidget scene="council" />
              </div>
              <div className="max-w-[68ch] space-y-5 lg:col-start-1">
                <MetricsTable metrics={pantheon.metrics} />
                <div className="flex flex-wrap gap-4">
                  <TrackedLink
                    href="/work/pantheon-trades"
                    event={{ name: "case_study_opened", properties: { slug: "pantheon-trades" } }}
                    className={linkClass}
                  >
                    /work/pantheon-trades
                  </TrackedLink>
                  {pantheon.links.demo ? (
                    <TrackedLink
                      href={pantheon.links.demo}
                      event={{ name: "demo_clicked", properties: { slug: "pantheon-trades" } }}
                      className={linkClass}
                      external
                    >
                      demo
                    </TrackedLink>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section id="blueprint" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="06" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// BLUEPRINT"}</Overline>
          {omni.tier === 1 ? (
            <article className="grid gap-8 lg:grid-cols-[minmax(0,68ch)_minmax(18rem,30rem)] lg:items-start">
              <div className="max-w-[68ch] space-y-5">
                <ResearchLabel project={omni} />
                <h2 data-reveal="lines" className="font-display text-4xl font-bold text-ink">{omni.name}</h2>
                <p className="text-xl text-bone">{omni.tagline}</p>
                <p className="text-dim">{omni.summary}</p>
              </div>
              <div data-reveal="row" className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
                <SceneWidget scene="torus" />
              </div>
              <div className="max-w-[68ch] space-y-5 lg:col-start-1">
                <MetricsTable metrics={omni.metrics} />
                <TrackedLink
                  href="/work/omni"
                  event={{ name: "case_study_opened", properties: { slug: "omni" } }}
                  className={linkClass}
                >
                  /work/omni
                </TrackedLink>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section id="light" className="relative overflow-hidden border-t border-faint px-6 py-section-y">
        <GhostNumeral value="07" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Overline>{"// LIGHT"}</Overline>
          {agiLedger.tier === 1 ? (
            <article className="grid gap-8 lg:grid-cols-[minmax(0,68ch)_minmax(18rem,30rem)] lg:items-start">
              <div className="max-w-[68ch] space-y-5">
                <h2 data-reveal="lines" className="font-display text-4xl font-bold text-ink">{agiLedger.name}</h2>
                <p className="text-xl text-bone">{agiLedger.tagline}</p>
                <p className="text-dim">{agiLedger.summary}</p>
              </div>
              <div data-reveal="row" className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end">
                <SceneWidget scene="stars" aspect="wide" />
              </div>
              <div className="max-w-[68ch] space-y-5 lg:col-start-1">
                <div className="flex flex-wrap gap-4">
                  <TrackedLink
                    href="/work/agi-ledger"
                    event={{ name: "case_study_opened", properties: { slug: "agi-ledger" } }}
                    className={linkClass}
                  >
                    /work/agi-ledger
                  </TrackedLink>
                  {agiLedger.links.demo ? (
                    <TrackedLink
                      href={agiLedger.links.demo}
                      event={{ name: "demo_clicked", properties: { slug: "agi-ledger" } }}
                      className={linkClass}
                      external
                    >
                      demo
                    </TrackedLink>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <Marquee />

      <section id="human" className="relative overflow-hidden bg-paper px-6 py-section-y text-soot">
        <GhostNumeral value="08" />
        <KineticWall tone="paper" position="absolute" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-10">
            <div>
              <div data-reveal="overline" data-parallax="soft" className="mb-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-soot/70">{"// HUMAN"}</p>
                <span data-reveal-rule className="mt-3 block h-px w-24 origin-left bg-soot/20" aria-hidden="true" />
              </div>
              <h2 data-reveal="lines" className="font-display text-4xl font-bold">{identity.name}</h2>
            </div>
            <ListBlock title="Affiliations" items={identity.affiliations} />
            <ListBlock title="Open source" items={identity.openSource} />
            <ListBlock title="Open to" items={identity.openTo} />
          </div>
          <div className="space-y-10">
            {photos.length > 0 ? <PhotoDeck photos={photos} /> : null}
            <ProjectRow project={tangled} inverted />
            <div className="border-t border-soot/20 pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-soot/70">Updated {now.updated}</p>
              <Link
                href="/now"
                className="mt-2 block text-xl text-soot underline decoration-soot/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
              >
                {now.building[0]}
              </Link>
            </div>
            <div className="space-y-4 border-t border-soot/20 pt-6">
              <EmailLink className="block text-soot underline decoration-soot/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone" />
              <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.12em]">
                <TrackedLink href={identity.socials.github} event={{ name: "github_clicked" }} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone" external>
                  GitHub
                </TrackedLink>
                <a href={identity.socials.linkedin} target="_blank" rel="noopener noreferrer" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                  LinkedIn
                </a>
                <a href={identity.socials.x} target="_blank" rel="noopener noreferrer" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                  X
                </a>
                <a href={identity.socials.huggingface} target="_blank" rel="noopener noreferrer" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                  HuggingFace
                </a>
                <TrackedLink href="/cv" event={{ name: "cv_downloaded" }} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                  CV
                </TrackedLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
