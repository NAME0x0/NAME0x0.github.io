"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

type ReadProgressProps = {
  slug: string;
};

export function ReadProgress({ slug }: ReadProgressProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    function handleScroll() {
      if (firedRef.current) {
        return;
      }

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 1;

      if (progress >= 0.5) {
        firedRef.current = true;
        trackAnalyticsEvent({ name: "writing_read_50pct", properties: { slug } });
        window.removeEventListener("scroll", handleScroll);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
