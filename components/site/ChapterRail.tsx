"use client";

import { useEffect, useState } from "react";
import { CHAPTER_SECTION_IDS } from "@/lib/film/progress";

const labels = ["Identity", "Metal", "Voice", "Proof", "Council", "Blueprint", "Light", "Human"] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const elements = CHAPTER_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const index = elements.indexOf(entry.target as HTMLElement);

          if (index >= 0) {
            setActive(index);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  function scrollTo(id: string) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-[90] hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col items-center gap-3">
        {CHAPTER_SECTION_IDS.map((id, index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-label={labels[index]}
              aria-current={active === index ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollTo(id);
              }}
              className="group flex h-5 w-5 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
            >
              <span
                className={`block rounded-full transition-all ${
                  active === index ? "h-2.5 w-2.5 bg-bone" : "h-1.5 w-1.5 bg-faint group-hover:bg-dim"
                }`}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
