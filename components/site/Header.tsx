import { identity } from "@/content/identity";
import { Scramble } from "@/components/site/Scramble";
import { TransitionLink } from "@/components/site/TransitionLink";
import { TrackedLink } from "@/components/site/TrackedLink";

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/cv", label: "CV", event: { name: "cv_downloaded" } },
] as const;

const linkClass =
  "font-mono text-xs uppercase tracking-[0.16em] text-dim transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone";

export function Header() {
  return (
    <>
      <a className="skip-link font-mono text-xs uppercase tracking-[0.14em]" href="#main">
        Skip to content
      </a>
      <header className="border-b border-faint/80 bg-void/95 px-6 py-5">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <TransitionLink
            href="/"
            className="font-display text-base font-bold text-ink transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
          >
            {identity.lockup}
          </TransitionLink>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {navItems.map((item) => (
              "event" in item ? (
                <TrackedLink key={item.href} href={item.href} event={item.event} className={linkClass}>
                  <Scramble>{item.label}</Scramble>
                </TrackedLink>
              ) : (
                <TransitionLink key={item.href} href={item.href} className={linkClass}>
                  <Scramble>{item.label}</Scramble>
                </TransitionLink>
              )
            ))}
            <TrackedLink
              href={identity.socials.github}
              event={{ name: "github_clicked" }}
              className={linkClass}
              external
            >
              <Scramble>GitHub</Scramble>
            </TrackedLink>
          </div>
        </nav>
      </header>
    </>
  );
}
