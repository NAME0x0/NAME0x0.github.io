"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ClaimReceipt } from "@/lib/content/claims";
import { checkFilmGate } from "@/lib/film/gate";

export type WidgetScene = "bars" | "council" | "torus" | "stars" | "reactor";
export type WidgetSceneData = ClaimReceipt[];

type SceneWidgetProps = {
  scene: WidgetScene;
  data?: WidgetSceneData;
  aspect?: "square" | "wide";
};

const SceneCanvas = dynamic(() => import("./SceneCanvas").then((module) => module.SceneCanvas), {
  ssr: false,
});

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const x = clamp01(value);

  return x * x * (3 - 2 * x);
}

export function SceneWidget({ scene, data, aspect = "square" }: SceneWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [entry, setEntry] = useState(0);

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
    let latched = false;
    let frame = 0;

    const updateActive = () => {
      setActive(intersects && !document.hidden);
    };
    const tick = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = Math.max(window.innerHeight, 1);
      const raw = clamp01((viewportHeight - rect.top) / (viewportHeight * 0.7));
      const next = latched ? 1 : smoothstep(raw);

      if (next >= 0.999) {
        latched = true;
      }

      setEntry((current) => (latched ? 1 : Math.max(current, next)));
      setActive(!document.hidden && (intersects || (!latched && next > 0)));
      frame = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        intersects = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        updateActive();
      },
      { threshold: [0, 0.25, 1] },
    );
    const onVisibility = () => {
      updateActive();
    };

    observer.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`${aspect === "wide" ? "aspect-[16/9] max-w-[44rem]" : "aspect-square max-w-[38rem]"} w-full self-start overflow-hidden bg-transparent lg:sticky lg:top-24`}
    >
      <SceneCanvas scene={scene} active={active} entry={entry} data={data} />
    </div>
  );
}
