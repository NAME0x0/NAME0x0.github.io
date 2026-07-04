"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CursorDotMotion = dynamic(() => import("./CursorDotMotion").then((module) => module.CursorDotMotion), {
  ssr: false,
});

export function CursorDot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(media.matches && !reduced.matches);

    update();
    media.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <CursorDotMotion />;
}
