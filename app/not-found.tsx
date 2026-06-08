import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Signal Lost",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      role="main"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-void px-6 text-center"
    >
      {/* HUD frame, echoing the hero enclave styling */}
      <div className="pointer-events-none absolute inset-4 m-4 border border-ink-faint/30 sm:m-8 lg:m-12" aria-hidden="true">
        <div className="absolute -left-px -top-px h-2 w-2 border-l border-t border-ink-dim/50" />
        <div className="absolute -right-px -top-px h-2 w-2 border-r border-t border-ink-dim/50" />
        <div className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-ink-dim/50" />
        <div className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-ink-dim/50" />
      </div>

      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-dim">
        {"// SIGNAL_LOST"}
      </p>

      <h1 className="font-heading text-[clamp(4rem,18vw,10rem)] font-bold leading-none tracking-[-0.05em] text-ink">
        404
      </h1>

      <p className="mt-6 max-w-[44ch] text-balance font-body text-sm text-ink-dim sm:text-base">
        This route does not exist in the enclave. The signal terminated before it
        could resolve.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 items-center border border-ink/40 bg-void/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        &quot;RETURN TO BASE&quot;
      </Link>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim/70">
        SECURE ENCLAVE ACTIVE
      </p>
    </main>
  );
}
