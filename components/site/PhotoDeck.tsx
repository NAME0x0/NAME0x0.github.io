"use client";

import Image from "next/image";
import { useEffect, useState, type ComponentType } from "react";
import type { PhotoEntry } from "@/lib/content/photos";

type PhotoDeckProps = {
  photos: PhotoEntry[];
};

function StaticGrid({ photos }: PhotoDeckProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.slice(0, 4).map((photo) => (
        <div key={photo.src} className="relative aspect-[4/5] border border-soot/20">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 12rem, 45vw" className="object-cover" unoptimized />
        </div>
      ))}
    </div>
  );
}

export function PhotoDeck({ photos }: PhotoDeckProps) {
  const [MotionDeck, setMotionDeck] = useState<ComponentType<PhotoDeckProps> | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (photos.length === 0) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(reducedMotion.matches);

    update();
    reducedMotion.addEventListener("change", update);

    if (!reducedMotion.matches) {
      void import("./PhotoDeckMotion").then((module) => {
        setMotionDeck(() => module.PhotoDeckMotion);
      });
    }

    return () => {
      reducedMotion.removeEventListener("change", update);
    };
  }, [photos.length]);

  if (photos.length === 0) {
    return null;
  }

  if (reduced || !MotionDeck) {
    return <StaticGrid photos={photos} />;
  }

  return <MotionDeck photos={photos} />;
}
