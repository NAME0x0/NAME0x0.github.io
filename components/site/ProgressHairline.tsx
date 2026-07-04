"use client";

import { useEffect, useRef } from "react";

export function ProgressHairline() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const schedule = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 top-0 z-[140] h-[1.5px] w-full origin-left scale-x-0 bg-signal/70"
      aria-hidden="true"
    />
  );
}
