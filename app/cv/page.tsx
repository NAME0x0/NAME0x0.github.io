import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
};

export default function CvPage() {
  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="max-w-[68ch] space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// CV"}</p>
          <h1 className="font-display text-4xl font-bold text-ink">CV</h1>
        </header>
        <div className="max-w-[68ch] space-y-4 border-t border-faint pt-8">
          <a
            href="/cv/muhammad-afsah-cv.pdf"
            className="text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
          >
            General CV — PDF
          </a>
          <p className="text-dim">Role-specific variants are available on request.</p>
        </div>
      </div>
    </main>
  );
}
