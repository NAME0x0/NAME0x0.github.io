// Adapted from ReactBits StaggeredMenu by David Haz, MIT License.
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { TransitionLink } from "@/components/site/TransitionLink";

type StaggeredMenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  restoreFocusRef: RefObject<HTMLButtonElement>;
  socials: {
    github: string;
    linkedin: string;
    x: string;
    huggingface: string;
  };
};

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/photos", label: "Photos" },
  { href: "/cv", label: "CV" },
] as const;

function getFocusable(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");
}

export function StaggeredMenu({ id, open, onClose, restoreFocusRef, socials }: StaggeredMenuProps) {
  const [present, setPresent] = useState(open);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const motionReducedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      motionReducedRef.current = media.matches;
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setPresent(true);
    }
  }, [open]);

  useEffect(() => {
    if (!present) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [present]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !present) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusable(root);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, present]);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;

    if (!root || !panel || !present) {
      return undefined;
    }

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-menu-layer]"));
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-menu-item]"));
    const socialsEls = Array.from(root.querySelectorAll<HTMLElement>("[data-menu-social]"));
    let cancelled = false;
    let cleanup: () => void = () => undefined;

    if (motionReducedRef.current) {
      if (open) {
        window.setTimeout(() => getFocusable(root)[0]?.focus(), 0);
      } else {
        setPresent(false);
        restoreFocusRef.current?.focus();
      }

      return undefined;
    }

    void import("gsap").then((module) => {
      if (cancelled) {
        return;
      }

      const gsap = module.default;
      const ctx = gsap.context(() => {
        if (open) {
          gsap.set(root, { autoAlpha: 1 });
          gsap.fromTo(layers, { xPercent: 100 }, { xPercent: 0, duration: 0.58, ease: "power4.out", stagger: 0.07 });
          gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.72, ease: "power4.out", delay: 0.12 });
          gsap.fromTo(
            items,
            { yPercent: 120, rotate: 6, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, duration: 0.72, ease: "power4.out", stagger: 0.08, delay: 0.28 },
          );
          gsap.fromTo(
            socialsEls,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.48, ease: "power3.out", stagger: 0.06, delay: 0.48 },
          );
          window.setTimeout(() => getFocusable(root)[0]?.focus(), 120);
        } else {
          gsap.to([panel, ...layers], {
            xPercent: 100,
            duration: 0.32,
            ease: "power3.in",
            onComplete: () => {
              setPresent(false);
              restoreFocusRef.current?.focus();
            },
          });
        }
      }, root);

      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [open, present, restoreFocusRef]);

  if (!present) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[80] bg-transparent"
    >
      <div data-menu-layer className="absolute inset-0 bg-soot" aria-hidden="true" />
      <div data-menu-layer className="absolute inset-0 bg-void/95" aria-hidden="true" />
      <div
        ref={panelRef}
        className="absolute inset-0 overflow-y-auto bg-void px-6 py-24 text-ink md:px-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="fixed right-4 top-4 z-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-dim transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone md:right-6 md:top-5"
        >
          <span aria-hidden="true" className="relative grid h-6 w-6 place-items-center">
            <span className="absolute h-px w-5 rotate-45 bg-current" />
            <span className="absolute h-px w-5 -rotate-45 bg-current" />
          </span>
          Close
        </button>
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl flex-col justify-between gap-14">
          <ul className="space-y-4">
            {links.map((link, index) => (
              <li key={link.href} className="overflow-hidden">
                <div data-menu-item className="flex flex-col gap-4 md:flex-row md:items-center">
                  <TransitionLink
                    href={link.href}
                    onClick={onClose}
                    className="group inline-flex items-baseline gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
                  >
                    <span className="font-mono text-sm text-signal">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display text-5xl font-bold uppercase leading-none text-bone transition-colors group-hover:text-ink md:text-7xl">
                      {link.label}
                    </span>
                  </TransitionLink>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-5 border-t border-faint pt-6 font-mono text-xs uppercase tracking-[0.14em] text-dim">
            {[
              ["GitHub", socials.github],
              ["LinkedIn", socials.linkedin],
              ["X", socials.x],
              ["HuggingFace", socials.huggingface],
            ].map(([label, href]) => (
              <a
                key={href}
                data-menu-social
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
