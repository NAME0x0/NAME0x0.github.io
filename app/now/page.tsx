import type { Metadata } from "next";
import { now } from "@/lib/content/now";

export const metadata: Metadata = {
  title: "Now",
};

export default function NowPage() {
  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="max-w-[68ch] space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// NOW"}</p>
          <h1 className="font-display text-4xl font-bold text-ink">Now</h1>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Updated {now.updated}</p>
          <p className="text-xl text-bone">{now.body}</p>
        </header>

        <NowList title="// BUILDING" items={now.building} />
        <NowList title="// READING" items={now.reading} />
        <NowList title="// PLAYING" items={now.playing} />
      </div>
    </main>
  );
}

function NowList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="max-w-[68ch] border-t border-faint pt-8">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">{title}</h2>
      {items.length > 0 ? (
        <ul className="space-y-3 text-dim">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-dim">None listed.</p>
      )}
    </section>
  );
}
