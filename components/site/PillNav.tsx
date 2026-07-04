// Adapted from ReactBits PillNav by David Haz, MIT License.
"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { StaggeredMenu } from "@/components/site/StaggeredMenu";
import type { PhotoEntry } from "@/lib/content/photos";

type PillNavProps = {
  lockup: string;
  socials: {
    github: string;
    linkedin: string;
    x: string;
    huggingface: string;
  };
  photos: PhotoEntry[];
};

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/photos", label: "Photos" },
  { href: "/cv", label: "CV" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PillNav({ lockup, socials, photos }: PillNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <a className="skip-link font-mono text-xs uppercase tracking-[0.14em]" href="#main">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-faint/70 bg-void/90 px-4 py-3 backdrop-blur md:px-6">
        <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center gap-4">
          <TransitionLink
            href="/"
            className="min-w-0 flex-1 truncate font-display text-sm font-bold text-ink transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone md:text-base"
          >
            {lockup}
          </TransitionLink>

          <ul className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative inline-flex h-10 overflow-hidden rounded-full border px-4 font-mono text-xs uppercase tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone ${
                      active ? "border-bone bg-bone text-void" : "border-faint text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-1/2 aspect-square w-[150%] -translate-x-1/2 translate-y-[54%] rounded-full bg-bone transition-transform duration-300 ease-out motion-reduce:duration-0 ${
                        active ? "scale-100" : "scale-0 group-hover:scale-100"
                      }`}
                    />
                    <span className="relative z-10 grid place-items-center overflow-hidden">
                      <span className={`transition-transform duration-300 motion-reduce:duration-0 ${active ? "-translate-y-8" : "group-hover:-translate-y-8"}`}>
                        {item.label}
                      </span>
                      <span className={`absolute text-void transition-transform duration-300 motion-reduce:duration-0 ${active ? "translate-y-0" : "translate-y-8 group-hover:translate-y-0"}`}>
                        {item.label}
                      </span>
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>

          <button
            ref={buttonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu"
            onClick={() => setOpen((current) => !current)}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-faint text-bone transition-colors hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:duration-0 ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity duration-200 motion-reduce:duration-0 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:duration-0 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>
      </header>
      <StaggeredMenu
        id="staggered-menu"
        open={open}
        onClose={() => setOpen(false)}
        restoreFocusRef={buttonRef}
        socials={socials}
        photos={photos}
      />
    </>
  );
}
