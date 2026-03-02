"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DESKTOP_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
  SECTION_ORDER,
  getSectionPosition,
  type SectionId,
} from "@/lib/navigation/sections";

gsap.registerPlugin(ScrollTrigger);

type NavigationProps = {
  activeSection: SectionId;
};

export function Navigation({ activeSection }: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const mobileLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const activePosition = getSectionPosition(activeSection);
  const totalSections = SECTION_ORDER.length;

  const scrollToSection = useCallback((sectionId: SectionId) => {
    if (typeof window === "undefined") {
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  }, []);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, sectionId: SectionId, closeMenu: boolean) => {
      event.preventDefault();
      if (closeMenu) {
        setIsOpen(false);
      }
      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  // Nav bar visibility on scroll
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

      const heroEl = document.getElementById("hero");

      ScrollTrigger.create({
        trigger: heroEl ?? document.documentElement,
        start: heroEl ? "bottom top" : "100vh top",
        onEnter: () => visibilityTween.play(),
        onLeaveBack: () => visibilityTween.reverse(),
      });
    }, navEl);

    return () => ctx.revert();
  }, []);

  // Escape key to close
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

  // aria-hidden on <main> when mobile menu opens
  useEffect(() => {
    const mainEl = document.getElementById("main");
    if (!mainEl) return;

    if (isOpen) {
      mainEl.setAttribute("aria-hidden", "true");
    } else {
      mainEl.removeAttribute("aria-hidden");
    }

    return () => {
      mainEl.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  // Overlay open/close animation + focus trap
  useEffect(() => {
    const overlayEl = overlayRef.current;
    if (!overlayEl || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isOpen) {
      const previousActiveElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousActiveElementRef.current = previousActiveElement;
      document.body.style.overflow = "hidden";

      const ctx = gsap.context(() => {
        gsap.to(overlayEl, {
          opacity: 1,
          duration: prefersReducedMotion ? 0 : 0.2,
          ease: "power2.out",
        });

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

      const focusTarget = closeButtonRef.current ?? mobileLinkRefs.current[0];
      if (focusTarget) {
        window.requestAnimationFrame(() => {
          focusTarget.focus();
        });
      }

      const trapFocus = (event: KeyboardEvent) => {
        if (event.key !== "Tab") {
          return;
        }

        const focusable = Array.from(
          overlayEl.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
          )
        ).filter((element) => !element.hasAttribute("disabled"));

        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      };

      window.addEventListener("keydown", trapFocus);

      return () => {
        window.removeEventListener("keydown", trapFocus);
        ctx.revert();
      };
    } else {
      // Animate out
      const ctx = gsap.context(() => {
        gsap.to(overlayEl, {
          opacity: 0,
          duration: prefersReducedMotion ? 0 : 0.2,
          ease: "power2.in",
        });
      }, overlayEl);

      document.body.style.overflow = "";
      const restoreTarget = previousActiveElementRef.current ?? menuButtonRef.current;
      restoreTarget?.focus();
      previousActiveElementRef.current = null;

      return () => {
        ctx.revert();
      };
    }
  }, [isOpen]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div ref={navRef} className="fixed top-0 z-40 w-full pointer-events-none opacity-0">
        <nav
          aria-label="Main navigation"
          className="relative hidden h-16 items-center justify-between border-b border-ink/10 bg-void/80 px-6 backdrop-blur-[12px] transition-all duration-500 lg:flex xl:px-8"
        >
          <a
            href="#hero"
            onClick={(event) => handleNavClick(event, "hero", false)}
            className="group inline-flex min-h-11 items-center gap-0.5 px-1 font-mono text-sm font-semibold tracking-[0.04em] text-ink transition-opacity duration-300 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-current={activeSection === "hero" ? "page" : undefined}
            aria-label="NAME0x0, go to home"
          >
            <span className="text-ink-dim/50 transition-colors duration-300 group-hover:text-ink-dim" aria-hidden="true">&quot;</span>
            <span>NAME0x0</span>
            <span className="text-ink-dim/50 transition-colors duration-300 group-hover:text-ink-dim" aria-hidden="true">&quot;</span>
          </a>

          <div className="relative flex items-center gap-7">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => handleNavClick(event, item.id, false)}
                  className={`inline-flex min-h-11 items-center px-1 font-mono text-sm uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${isActive ? "text-ink font-semibold" : "text-ink-dim font-medium hover:text-ink"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive ? `[ "${item.label}" ]` : item.label}
                </a>
              );
            })}
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
            {`PAGE ${String(activePosition).padStart(2, "0")} / ${String(totalSections).padStart(2, "0")}`}
          </p>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-45"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(232, 228, 222, 0.3) 0 12px, transparent 12px 20px)",
            }}
          />
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-dialog"
          onClick={() => setIsOpen(true)}
          className={`fixed right-4 top-4 z-50 h-11 w-11 items-center justify-center p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:hidden ${isOpen ? "hidden" : "flex"
            }`}
        >
          <span className="flex flex-col space-y-[5px]">
            <span className="h-[2px] w-6 bg-ink" />
            <span className="h-[2px] w-6 bg-ink" />
            <span className="h-[2px] w-6 bg-ink" />
          </span>
        </button>
      </div>

      {/* Always-mounted mobile overlay — animated via opacity */}
      <div
        ref={overlayRef}
        id="mobile-navigation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] bg-void ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle at center, rgba(232, 228, 222, 0.08) 0%, rgba(0, 0, 0, 0) 55%), #000000",
        }}
        onMouseDown={(event) => {
          if (isOpen && event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <h2 id="mobile-navigation-title" className="sr-only">
          Site navigation
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-[70] h-11 w-11 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <span className="relative block h-6 w-6">
            <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 rotate-45 bg-ink" />
            <span className="absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 -rotate-45 bg-ink" />
          </span>
        </button>

        <nav aria-label="Main navigation" className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {MOBILE_NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                ref={(element) => {
                  mobileLinkRefs.current[index] = element;
                }}
                tabIndex={isOpen ? 0 : -1}
                onClick={(event) => handleNavClick(event, item.id, true)}
                className={`font-mono text-xl uppercase tracking-[0.14em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:text-2xl ${activeSection === item.id ? "text-ink font-bold" : "text-ink-dim hover:text-ink"
                  }`}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {activeSection === item.id ? `[ "${item.label}" ]` : item.label}
              </a>
            ))}
          </div>
        </nav>

        <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim">
          {`PAGE ${String(activePosition).padStart(2, "0")} / ${String(totalSections).padStart(2, "0")}`}
        </p>
      </div>
    </>
  );
}

export default Navigation;
