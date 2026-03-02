"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface FilterTabsProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
  controlsId?: string;
  label?: string;
}

export function FilterTabs({
  categories,
  active,
  onChange,
  controlsId,
  label = "Project category filters",
}: FilterTabsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorReady, setIndicatorReady] = useState(false);

  useEffect(() => {
    const containerEl = containerRef.current;
    const indicatorEl = indicatorRef.current;

    if (!containerEl || !indicatorEl) {
      setIndicatorReady(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const positionIndicator = (animate: boolean) => {
        const activeTab = tabRefs.current[active];

        if (!activeTab) {
          setIndicatorReady(false);
          return;
        }

        const containerRect = containerEl.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        const left = tabRect.left - containerRect.left + containerEl.scrollLeft;
        const width = tabRect.width;

        setIndicatorReady(true);

        if (animate && !prefersReducedMotion) {
          gsap.to(indicatorEl, {
            left,
            width,
            duration: 0.28,
            ease: "power3.out",
          });
          return;
        }

        gsap.set(indicatorEl, { left, width });
      };

      positionIndicator(true);

      const handleLayoutChange = () => positionIndicator(false);

      window.addEventListener("resize", handleLayoutChange);
      containerEl.addEventListener("scroll", handleLayoutChange, { passive: true });

      return () => {
        window.removeEventListener("resize", handleLayoutChange);
        containerEl.removeEventListener("scroll", handleLayoutChange);
      };
    }, containerEl);

    return () => ctx.revert();
  }, [active, categories]);

  return (
    <div
      ref={containerRef}
      role="toolbar"
      aria-label={label}
      className="relative flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isActive = active === category;
        const activeClass =
          isActive && !indicatorReady
            ? "border-b-2 border-ink text-ink"
            : isActive
              ? "text-ink"
              : "text-ink-dim hover:text-ink";
        const currentIndex = categories.indexOf(category);

        return (
          <button
            key={category}
            ref={(element) => {
              tabRefs.current[category] = element;
            }}
            type="button"
            onClick={() => onChange(category)}
            onKeyDown={(event) => {
              if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowLeft" &&
                event.key !== "Home" &&
                event.key !== "End"
              ) {
                return;
              }

              event.preventDefault();

              let nextIndex = currentIndex;
              if (event.key === "ArrowRight") {
                nextIndex = (currentIndex + 1) % categories.length;
              } else if (event.key === "ArrowLeft") {
                nextIndex = (currentIndex - 1 + categories.length) % categories.length;
              } else if (event.key === "Home") {
                nextIndex = 0;
              } else if (event.key === "End") {
                nextIndex = categories.length - 1;
              }

              const nextCategory = categories[nextIndex];
              onChange(nextCategory);
              tabRefs.current[nextCategory]?.focus();
            }}
            aria-pressed={isActive}
            aria-controls={controlsId}
            className={`inline-flex min-h-11 items-center whitespace-nowrap px-1 pb-2 pt-2 font-mono text-sm uppercase tracking-[0.1em] transition-colors duration-200 ${activeClass}`}
          >
            {category}
          </button>
        );
      })}

      <div
        ref={indicatorRef}
        className={`pointer-events-none absolute bottom-0 h-[2px] bg-ink transition-opacity duration-200 ${
          indicatorReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: 0, width: 0 }}
        aria-hidden="true"
      />
    </div>
  );
}

export default FilterTabs;
