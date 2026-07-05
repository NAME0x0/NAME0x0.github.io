"use client";

import { useEffect, useState, type ComponentType } from "react";

export function CursorDot() {
  const [MotionDot, setMotionDot] = useState<ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (!media.matches || reduced.matches) {
        setMotionDot(null);
        return;
      }

      void import("./CursorDotMotion").then((module) => {
        if (mounted && media.matches && !reduced.matches) {
          setMotionDot(() => module.CursorDotMotion);
        }
      });
    };

    update();
    media.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      mounted = false;
      media.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (!MotionDot) {
    return null;
  }

  return <MotionDot />;
}
