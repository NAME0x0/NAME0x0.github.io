"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PhotoEntry } from "@/lib/content/photos";
import { Masonry } from "./Masonry";

type PhotosViewProps = {
  photos: PhotoEntry[];
};

type View = "masonry" | "dome" | "sphere";

const DomeGallery = dynamic(() => import("./DomeGallery").then((module) => module.DomeGallery), {
  ssr: false,
  loading: () => <div className="h-[72vh] min-h-[28rem] border border-faint" />,
});
const InfiniteSphere = dynamic(() => import("./InfiniteSphere").then((module) => module.InfiniteSphere), {
  ssr: false,
  loading: () => <div className="h-[72vh] min-h-[28rem] border border-faint" />,
});

export function PhotosView({ photos }: PhotosViewProps) {
  const [view, setView] = useState<View>("masonry");
  const [gpuEnabled, setGpuEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(media.matches);

      if (media.matches) {
        setView("masonry");
      }
    };

    updateMotion();
    media.addEventListener("change", updateMotion);
    void import("@/lib/film/gate")
      .then((module) => module.checkFilmGate())
      .then((passes) => {
        if (!cancelled) {
          setGpuEnabled(passes);
        }
      });

    return () => {
      cancelled = true;
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  const canUseGpuViews = gpuEnabled && !reducedMotion;

  function select(nextView: View) {
    if (nextView !== "masonry" && !canUseGpuViews) {
      setView("masonry");
      return;
    }

    setView(nextView);
  }

  return (
    <div className="space-y-10">
      {!reducedMotion ? (
        <div className="flex flex-wrap gap-5 font-mono text-xs uppercase tracking-[0.16em]">
          {(["masonry", "dome", "sphere"] as const).map((option) => {
            const disabled = option !== "masonry" && !canUseGpuViews;
            const active = view === option;

            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                title={disabled ? "needs a capable GPU" : undefined}
                onClick={() => select(option)}
                className={`underline-offset-8 transition-colors ${
                  active
                    ? "text-signal underline decoration-signal"
                    : disabled
                      ? "cursor-not-allowed text-dim/50"
                      : "text-dim hover:text-bone"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}

      {view === "masonry" ? <Masonry photos={photos} /> : null}
      {view === "dome" && canUseGpuViews ? <DomeGallery photos={photos} /> : null}
      {view === "sphere" && canUseGpuViews ? <InfiniteSphere photos={photos} /> : null}
    </div>
  );
}
