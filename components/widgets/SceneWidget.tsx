"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { checkFilmGate } from "@/lib/film/gate";

export type WidgetScene = "bars" | "council" | "torus" | "stars";

type SceneWidgetProps = {
  scene: WidgetScene;
};

const SceneCanvas = dynamic(() => import("./SceneCanvas").then((module) => module.SceneCanvas), {
  ssr: false,
});

export function SceneWidget({ scene }: SceneWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void checkFilmGate().then((passes) => {
      if (!cancelled && passes) {
        setEnabled(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || !container) {
      return undefined;
    }

    let intersects = false;
    const updateActive = () => {
      setActive(intersects && !document.hidden);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        intersects = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        updateActive();
      },
      { threshold: [0, 0.25, 1] },
    );
    const onVisibility = () => updateActive();

    observer.observe(container);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className="aspect-[4/3] w-full max-w-[30rem] overflow-hidden bg-transparent">
      <SceneCanvas scene={scene} active={active} />
    </div>
  );
}
