import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="px-6 py-section-y">
      <div className="mx-auto max-w-6xl max-w-[68ch] space-y-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{"// 404"}</p>
        <h1 className="font-display text-4xl font-bold text-ink">This route was never trained on.</h1>
        <Link
          href="/"
          className="inline-flex text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
