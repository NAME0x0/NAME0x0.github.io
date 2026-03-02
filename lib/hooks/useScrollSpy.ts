import { useEffect, useRef, useState } from "react";

export function useScrollSpy(sectionIds: readonly string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");
  const activeRef = useRef<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) {
      return;
    }

    const getActiveSection = () => {
      const viewportHeight = window.innerHeight || 1;
      const anchorY = Math.max(96, viewportHeight * 0.35);
      let bestId = activeRef.current || sectionIds[0];
      let bestScore = Number.NEGATIVE_INFINITY;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const visiblePixels = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
        );
        const sectionHeight = Math.max(1, rect.height);
        const normalizedVisible = visiblePixels / Math.min(sectionHeight, viewportHeight);
        const sectionCenter = rect.top + rect.height / 2;
        const distanceToAnchor = Math.abs(sectionCenter - anchorY);
        const anchorWithinSection = rect.top <= anchorY && rect.bottom >= anchorY ? 1 : 0;

        const score =
          visiblePixels +
          normalizedVisible * viewportHeight * 0.8 +
          anchorWithinSection * viewportHeight * 1.6 -
          distanceToAnchor * 0.2;

        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      return bestId;
    };

    let rafId = 0;

    const updateActive = () => {
      const nextActive = getActiveSection();
      if (nextActive && nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateActive);
    };

    requestUpdate();

    const warmupTimers = [
      window.setTimeout(requestUpdate, 80),
      window.setTimeout(requestUpdate, 250),
      window.setTimeout(requestUpdate, 700),
    ];

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      warmupTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, [sectionIds]);

  return active;
}

export default useScrollSpy;
