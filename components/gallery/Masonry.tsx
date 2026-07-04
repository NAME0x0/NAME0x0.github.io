// Adapted from ReactBits Masonry by David Haz, MIT License.
"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import type { PhotoEntry } from "@/lib/content/photos";

type MasonryProps = {
  photos: PhotoEntry[];
};

export function Masonry({ photos }: MasonryProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void import("gsap").then((module) => {
      if (cancelled) {
        return;
      }

      const gsap = module.default;
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-masonry-item]"));

      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { y: 28, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.045,
          },
        );
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [photos]);

  return (
    <div ref={rootRef} className="columns-2 gap-4 md:columns-3 xl:columns-4">
      {photos.map((photo) => (
        <figure
          key={photo.src}
          data-masonry-item
          className="mb-4 break-inside-avoid overflow-hidden border border-faint bg-void transition-colors duration-300 hover:border-bone"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          />
          <figcaption className="border-t border-faint px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-dim">
            {photo.kind === "professional" ? "headshot" : photo.kind === "profile" ? "profile" : "off duty"}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
