"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { CHAPTER_SECTION_IDS } from "@/lib/film/progress";

export function ChapterTracker() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const reached = new Set<number>();
    const elements = CHAPTER_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            return;
          }

          const chapter = elements.indexOf(entry.target as HTMLElement);

          if (chapter < 0 || reached.has(chapter)) {
            return;
          }

          reached.add(chapter);
          trackAnalyticsEvent({
            name: "chapter_reached",
            properties: { chapter: chapter as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 },
          });
        });
      },
      { threshold: [0.5] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
