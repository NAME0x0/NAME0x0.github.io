"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { PhotoEntry } from "@/lib/content/photos";

type PhotoDeckMotionProps = {
  photos: PhotoEntry[];
};

const rotations = [-2.8, 2.1, -1.4, 2.9, -2.2, 1.2] as const;

export function PhotoDeckMotion({ photos }: PhotoDeckMotionProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % photos.length);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Advance photo deck"
      className="relative block aspect-[4/5] w-full max-w-sm border-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
      onClick={() => setActive((value) => (value + 1) % photos.length)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {photos.map((photo, index) => {
        const offset = (index - active + photos.length) % photos.length;
        const isTop = offset === 0;
        const zIndex = photos.length - offset;

        return (
          <motion.div
            key={photo.src}
            className="absolute inset-0 border border-soot/20 bg-paper shadow-[0_18px_40px_rgba(28,26,23,0.12)]"
            style={{ zIndex }}
            animate={{
              opacity: offset < 4 ? 1 - offset * 0.16 : 0,
              y: isTop ? 0 : offset * 8,
              x: offset * 5,
              rotate: rotations[index % rotations.length],
              scale: 1 - offset * 0.035,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 22rem, 90vw" className="object-cover" unoptimized />
          </motion.div>
        );
      })}
    </button>
  );
}
