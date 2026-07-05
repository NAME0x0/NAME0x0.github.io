// Adapted from ReactBits DomeGallery by David Haz, MIT License.
"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import type { PhotoEntry } from "@/lib/content/photos";

type DomeGalleryProps = {
  photos: PhotoEntry[];
};

type Rotation = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildTiles(photos: PhotoEntry[]) {
  const count = Math.max(photos.length, 1);

  return photos.map((photo, index) => {
    const row = index % 3;
    const band = [-18, 0, 18][row];
    const angle = (index / count) * 360 + row * 16;

    return { photo, rotateX: band, rotateY: angle };
  });
}

export function DomeGallery({ photos }: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: -4, y: 0 });
  const velocityRef = useRef<Rotation>({ x: 0, y: 0 });
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef(0);
  const tiles = useMemo(() => buildTiles(photos), [photos]);

  useEffect(() => {
    const root = rootRef.current;
    const sphere = sphereRef.current;

    if (!root || !sphere) {
      return undefined;
    }

    const apply = () => {
      sphere.style.transform = `translateZ(calc(var(--dome-radius) * -1)) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
    };
    const resize = () => {
      const rect = root.getBoundingClientRect();
      const radius = Math.round(Math.max(260, Math.min(620, Math.min(rect.width, rect.height) * 0.72)));

      root.style.setProperty("--dome-radius", `${radius}px`);
      apply();
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      velocityRef.current = { x: 0, y: 0 };
      root.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;

      if (!pointer) {
        return;
      }

      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;

      pointerRef.current = { x: event.clientX, y: event.clientY };
      rotationRef.current.y += dx * 0.18;
      rotationRef.current.x = clamp(rotationRef.current.x - dy * 0.12, -24, 12);
      velocityRef.current = { x: -dy * 0.12, y: dx * 0.18 };
      apply();
    };
    const onPointerUp = (event: PointerEvent) => {
      pointerRef.current = null;

      if (root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
    };
    const tick = () => {
      if (!pointerRef.current) {
        rotationRef.current.x = clamp(rotationRef.current.x + velocityRef.current.x, -24, 12);
        rotationRef.current.y += velocityRef.current.y;
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.94;
        apply();
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };
    const observer = new ResizeObserver(resize);

    observer.observe(root);
    resize();
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-[72vh] min-h-[28rem] overflow-hidden bg-void touch-none" style={{ perspective: "900px" }}>
      <div ref={sphereRef} className="absolute inset-0 m-auto h-0 w-0 [transform-style:preserve-3d]">
        {tiles.map(({ photo, rotateX, rotateY }) => (
          <div
            key={`${photo.src}-${rotateX}-${rotateY}`}
            className="absolute -left-24 -top-32 h-64 w-48 overflow-hidden border border-faint bg-void shadow-[0_20px_80px_rgba(0,0,0,0.45)] [backface-visibility:hidden] [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(var(--dome-radius))` }}
          >
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} draggable={false} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_55%,#000_100%)]" />
    </div>
  );
}
