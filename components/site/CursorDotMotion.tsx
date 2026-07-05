"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorDotMotion() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.35 });
  const springScale = useSpring(scale, { stiffness: 420, damping: 20, mass: 0.25 });

  useEffect(() => {
    let idleTimer = 0;

    const blink = () => {
      scale.set(1.9);
      window.setTimeout(() => scale.set(1), 120);
      idleTimer = window.setTimeout(blink, 10000);
    };
    const resetIdle = () => {
      window.clearTimeout(idleTimer);
      scale.set(1);
      idleTimer = window.setTimeout(blink, 10000);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);
      resetIdle();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    idleTimer = window.setTimeout(blink, 10000);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [scale, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-bone"
      style={{ x: springX, y: springY, scale: springScale, marginLeft: -3, marginTop: -3, opacity: 0.5 }}
    />
  );
}
