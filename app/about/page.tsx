import type { Metadata } from "next";
import { identity } from "@/content/identity";

export const metadata: Metadata = {
  title: "About",
};

const linkClass =
  "text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

export default function AboutPage() {
  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="max-w-[68ch] space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// IDENTITY"}</p>
          <h1 className="font-display text-4xl font-bold text-ink">{identity.name}</h1>
          <p className="text-xl text-bone">{identity.role}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Fact label="Education" value={identity.education} />
          <Fact label="Location" value={identity.location} />
          <Fact label="Visa" value={identity.visa} />
        </section>

        <ListSection title="// AFFILIATIONS" items={identity.affiliations} />
        <ListSection title="// OPEN SOURCE" items={identity.openSource} />
        <ListSection title="// OPEN TO" items={identity.openTo} />

        <section className="max-w-[68ch] border-t border-faint pt-8">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// SOCIALS"}</h2>
          <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.12em]">
            <a href={identity.socials.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
            </a>
            <a href={identity.socials.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              LinkedIn
            </a>
            <a href={identity.socials.x} target="_blank" rel="noopener noreferrer" className={linkClass}>
              X
            </a>
            <a href={identity.socials.huggingface} target="_blank" rel="noopener noreferrer" className={linkClass}>
              HuggingFace
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-faint p-5">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-dim">{label}</p>
      <p className="text-ink">{value}</p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="max-w-[68ch] border-t border-faint pt-8">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{title}</h2>
      <ul className="space-y-3 text-dim">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
