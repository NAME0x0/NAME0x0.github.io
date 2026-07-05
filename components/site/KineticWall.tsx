"use client";

import { useEffect, useRef } from "react";

const PITCH = 44;
const PALETTES = {
  void: {
    base: [58, 56, 50],
    dim: [138, 133, 120],
    alpha: 0.35,
  },
  paper: {
    base: [28, 26, 23],
    dim: [138, 133, 120],
    alpha: 0.2,
  },
} as const;

type KineticWallProps = {
  tone?: "void" | "paper";
  position?: "fixed" | "absolute";
};

function mix(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

export function KineticWall({ tone = "void", position = "fixed" }: KineticWallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let resizeTimer = 0;
    let running = false;
    const palette = PALETTES[tone];
    let lastScrollY = window.scrollY;
    let scrollBoost = 1;
    const pointer = {
      x: -10000,
      y: -10000,
      targetX: -10000,
      targetY: -10000,
      active: false,
    };

    const isStatic = () => reduced.matches || coarsePointer.matches || window.innerWidth < 768;

    const draw = (time: number) => {
      const staticFrame = isStatic();
      const bounds = position === "absolute" ? canvas.getBoundingClientRect() : null;
      const fieldOffsetX = bounds ? -bounds.left : 0;
      const fieldOffsetY = bounds ? -bounds.top : 0;

      context.clearRect(0, 0, width, height);
      context.globalAlpha = palette.alpha;

      const scrollDrift = staticFrame ? 0 : -Math.max(-6, Math.min(6, window.scrollY * 0.018));
      const phase = staticFrame ? 0 : time * 0.0004;
      const scrollDelta = Math.abs(window.scrollY - lastScrollY);
      const targetBoost = staticFrame ? 1 : 1 + Math.min(0.5, scrollDelta * 0.015);

      lastScrollY = window.scrollY;
      scrollBoost += (targetBoost - scrollBoost) * 0.08;
      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      pointer.y += (pointer.targetY - pointer.y) * 0.12;

      for (let y = -PITCH - fieldOffsetY; y < height + PITCH - fieldOffsetY; y += PITCH) {
        for (let x = -PITCH - fieldOffsetX; x < width + PITCH - fieldOffsetX; x += PITCH) {
          const localX = x + fieldOffsetX;
          const localY = y + fieldOffsetY;
          const wave = 0.5 + Math.sin(phase + x * 0.006 + y * 0.004) * 0.5;
          const dx = localX - pointer.x;
          const dy = localY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const ripple = pointer.active && !staticFrame ? Math.max(0, 1 - distance / 130) : 0;
          const push = ripple * ripple * 6;
          const invDistance = 1 / Math.max(distance, 1);
          const dotX = localX + scrollDrift + dx * invDistance * push;
          const dotY = localY - scrollDrift * 0.35 + dy * invDistance * push;
          const amount = Math.min(0.42, (0.08 + wave * 0.16 + ripple * 0.18) * scrollBoost);

          context.fillStyle = `rgb(${mix(palette.base[0], palette.dim[0], amount)}, ${mix(palette.base[1], palette.dim[1], amount)}, ${mix(palette.base[2], palette.dim[2], amount)})`;
          context.beginPath();
          context.arc(dotX, dotY, 1.1 * dpr, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const tick = (time: number) => {
      draw(time);

      if (running && !document.hidden && !isStatic()) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const bounds = position === "absolute"
        ? canvas.parentElement?.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(bounds?.width ?? window.innerWidth, 1);
      height = Math.max(bounds?.height ?? window.innerHeight, 1);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 120);
    };

    const start = () => {
      running = true;
      window.cancelAnimationFrame(frame);
      resize();

      if (!document.hidden && !isStatic()) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(frame);

      if (!document.hidden && !isStatic()) {
        frame = window.requestAnimationFrame(tick);
      } else {
        draw(performance.now());
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (isStatic()) {
        return;
      }

      const rect = canvas.getBoundingClientRect();

      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.targetX = -10000;
      pointer.targetY = -10000;
    };

    start();
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);
    coarsePointer.addEventListener("change", start);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
      coarsePointer.removeEventListener("change", start);
    };
  }, [position, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none inset-0 z-0 ${position === "fixed" ? "fixed" : "absolute"}`}
      aria-hidden="true"
    />
  );
}
