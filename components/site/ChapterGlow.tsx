"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CHAPTER_SECTION_IDS } from "@/lib/film/progress";

const colors = [
  "196 181 160",
  "196 181 160",
  "196 181 160",
  "227 179 65",
  "196 181 160",
  "208 140 90",
  "232 228 222",
  "0 0 0",
] as const;

export function ChapterGlow() {
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

  return (
    <div
      className="chapter-glow pointer-events-none fixed right-[-12vw] top-[8vh] z-[2] h-[55vw] w-[55vw]"
      style={{ "--chapter-glow": colors[active], "--chapter-glow-opacity": active === 7 ? "0" : "0.1" } as CSSProperties}
      aria-hidden="true"
    />
  );
}
