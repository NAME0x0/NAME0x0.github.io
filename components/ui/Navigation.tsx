"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const SPY_SECTION_IDS: string[] = ["hero", "stack", "projects", "about", "contact"];

export function Navigation() {
  const navRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const desktopLinksRef = useRef<HTMLDivElement>(null);
  const desktopLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const mobileLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollContextRef = useRef<gsap.Context | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useScrollSpy(SPY_SECTION_IDS);

  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    scrollTweenRef.current?.kill();
    scrollContextRef.current?.revert();

    scrollContextRef.current = gsap.context(() => {
      scrollTweenRef.current = gsap.to(window, {
        scrollTo: `#${sectionId}`,
        duration: prefersReducedMotion ? 0 : 1,
        ease: prefersReducedMotion ? "none" : "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          scrollTweenRef.current = null;
          scrollContextRef.current?.revert();
          scrollContextRef.current = null;
        },
      });
    });
  }, []);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, sectionId: string, closeMenu: boolean) => {
      event.preventDefault();
      if (closeMenu) {
        setIsOpen(false);
      }
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const visibilityTween = gsap.to(navEl, {
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.3,
        paused: true,
        onStart: () => {
          navEl.style.pointerEvents = "auto";
        },
        onReverseComplete: () => {
          navEl.style.pointerEvents = "none";
          setIsOpen(false);
        },
      });

      ScrollTrigger.create({
        start: "100vh top",
        onEnter: () => visibilityTween.play(),
        onLeaveBack: () => visibilityTween.reverse(),
      });
    }, navEl);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const overlayEl = overlayRef.current;
    if (!overlayEl) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayEl,
        { opacity: prefersReducedMotion ? 1 : 0 },
        { opacity: 1, duration: prefersReducedMotion ? 0 : 0.2, ease: "power2.out" }
      );

      const links = mobileLinkRefs.current.filter(
        (link): link is HTMLAnchorElement => link !== null
      );
      if (links.length > 0) {
        gsap.fromTo(
          links,
          { y: prefersReducedMotion ? 0 : 30, opacity: prefersReducedMotion ? 1 : 0 },
          {
            y: 0,
            opacity: 1,
            stagger: prefersReducedMotion ? 0 : 0.1,
            duration: prefersReducedMotion ? 0 : 0.4,
            ease: "power2.out",
          }
        );
      }
    }, overlayEl);

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    const linksContainerEl = desktopLinksRef.current;
    if (!linksContainerEl || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // We are no longer using the animated bottom border indicator.
    // Active state is now handled purely via React state/props in the render loop
    // representing terminal style brackets `[ Link ]`.

  }, [activeSection]);

  useEffect(() => {
    return () => {
      scrollTweenRef.current?.kill();
      scrollContextRef.current?.revert();
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div ref={navRef} className="fixed top-0 z-40 w-full pointer-events-none opacity-0">
        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-between border-b border-ink-faint bg-void/80 px-6 py-4 backdrop-blur-[12px] transition-all duration-500 lg:flex"
        >
          <a
            href="#hero"
            onClick={(event) => handleNavClick(event, "hero", false)}
            className="font-heading text-sm font-bold text-ink transition-all duration-300 hover:tracking-[0.05em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            NAME0x0
          </a>

          <div ref={desktopLinksRef} className="relative flex items-center gap-8">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  ref={(element) => {
                    desktopLinkRefs.current[index] = element;
                  }}
                  onClick={(event) => handleNavClick(event, item.id, false)}
                  className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${isActive ? "text-ink font-semibold" : "text-ink-dim hover:text-ink"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? `[ ${item.label} ]` : item.label}
                </a>
              );
            })}
          </div>
        </nav>

        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setIsOpen(true)}
          className={`fixed right-4 top-4 z-50 items-center justify-center p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:hidden ${isOpen ? "hidden" : "flex"
            }`}
        >
          <span className="flex flex-col space-y-[5px]">
            <span className="h-[2px] w-6 bg-ink" />
            <span className="h-[2px] w-6 bg-ink" />
            <span className="h-[2px] w-6 bg-ink" />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[60] bg-void"
          style={{
            background:
              "radial-gradient(circle at center, rgba(232, 228, 222, 0.08) 0%, rgba(0, 0, 0, 0) 55%), #000000",
          }}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-[70] p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span className="relative block h-6 w-6">
              <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rotate-45 bg-ink" />
              <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 -rotate-45 bg-ink" />
            </span>
          </button>

          <nav aria-label="Main navigation" className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  ref={(element) => {
                    mobileLinkRefs.current[index] = element;
                  }}
                  onClick={(event) => handleNavClick(event, item.id, true)}
                  className={`font-mono text-xl uppercase tracking-widest transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:text-2xl ${activeSection === item.id ? "text-ink font-bold" : "text-ink-dim hover:text-ink"
                    }`}
                >
                  {activeSection === item.id ? `[ ${item.label} ]` : item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export default Navigation;
