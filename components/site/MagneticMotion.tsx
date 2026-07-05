"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

type MagneticMotionProps = {
  children: ReactNode;
};

function disabled() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function MagneticMotion({ children }: MagneticMotionProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.45 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (disabled()) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance > 120) {
      x.set(0);
      y.set(0);
      return;
    }

    const pull = Math.min(1, (120 - distance) / 120);

    x.set((dx / Math.max(distance, 1)) * pull * 8);
    y.set((dy / Math.max(distance, 1)) * pull * 8);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} onMouseMove={onMouseMove} onMouseLeave={reset}>
      {children}
    </motion.div>
  );
}
