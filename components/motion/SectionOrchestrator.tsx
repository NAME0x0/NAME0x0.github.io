"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS: string[] = ["hero", "stack", "projects", "about", "contact"];

export function SectionOrchestrator() {
  const progressWrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const progressWrapperEl = progressWrapperRef.current;
    const barEl = barRef.current;
    if (!progressWrapperEl || !barEl || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      let isVisible = false;

      gsap.to(barEl, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: prefersReducedMotion ? true : 0.3,
          onUpdate: (self) => {
            const shouldShow = self.progress > 0.05;

            if (shouldShow !== isVisible) {
              isVisible = shouldShow;
              gsap.to(progressWrapperEl, {
                opacity: shouldShow ? 1 : 0,
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            }

            window.dispatchEvent(
              new CustomEvent("portfolio-scroll-progress", {
                detail: { progress: self.progress },
              })
            );
          },
        },
      });
    }, progressWrapperEl);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("portfolio-section-active", {
        detail: { section: activeSection },
      })
    );
  }, [activeSection]);

  return (
    <div
      ref={progressWrapperRef}
      className="fixed top-0 left-0 z-50 h-[2px] w-full pointer-events-none opacity-0"
    >
      <div
        ref={barRef}
        className="h-full bg-ink shadow-[0_0_8px_rgba(232,228,222,0.3)] will-change-transform origin-left scale-x-0"
      />
    </div>
  );
}

export default SectionOrchestrator;
