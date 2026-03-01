"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface FilterTabsProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export function FilterTabs({ categories, active, onChange }: FilterTabsProps) {
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

        if (animate) {
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
      className="relative flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isActive = active === category;
        const activeClass =
          isActive && !indicatorReady
            ? "border-b-2 border-ink text-ink"
            : isActive
              ? "text-ink"
              : "text-ink-dim hover:text-ink";

        return (
          <button
            key={category}
            ref={(element) => {
              tabRefs.current[category] = element;
            }}
            type="button"
            onClick={() => onChange(category)}
            className={`whitespace-nowrap pb-1.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-200 ${activeClass}`}
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
