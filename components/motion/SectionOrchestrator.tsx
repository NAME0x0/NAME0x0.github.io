"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { SECTION_ORDER } from "@/lib/navigation/sections";

export function SectionOrchestrator() {
  const progressWrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const activeSection = useScrollSpy(SECTION_ORDER);

  useEffect(() => {
    const progressWrapperEl = progressWrapperRef.current;
    const barEl = barRef.current;
    if (!progressWrapperEl || !barEl || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let isVisible = false;
    let rafId = 0;

    const setScaleX = prefersReducedMotion
      ? (value: number) => {
          gsap.set(barEl, { scaleX: value });
        }
      : gsap.quickTo(barEl, "scaleX", {
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });

    const getProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const viewportHeight = window.innerHeight || doc.clientHeight || 1;
      const maxScroll = Math.max(1, scrollHeight - viewportHeight);

      return Math.max(0, Math.min(1, scrollTop / maxScroll));
    };

    const applyProgress = (progress: number) => {
      setScaleX(progress);

      const shouldShow = progress > 0.05;
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
          detail: { progress },
        })
      );
    };

    const update = () => {
      rafId = 0;
      applyProgress(getProgress());
    };

    const requestUpdate = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(update);
    };

    const warmupTimers = [
      window.setTimeout(requestUpdate, 80),
      window.setTimeout(requestUpdate, 250),
      window.setTimeout(requestUpdate, 700),
      window.setTimeout(requestUpdate, 1400),
    ];

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => requestUpdate())
        : null;

    resizeObserver?.observe(document.documentElement);
    resizeObserver?.observe(document.body);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);

    requestUpdate();

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      warmupTimers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
    };
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
