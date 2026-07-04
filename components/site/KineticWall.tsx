"use client";

import { useEffect, useRef } from "react";

const PITCH = 44;
const BASE = [58, 56, 50] as const;
const DIM = [138, 133, 120] as const;

function mix(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

export function KineticWall() {
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
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let resizeTimer = 0;
    let running = false;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.globalAlpha = 0.35;

      const scrollDrift = reduced.matches ? 0 : -Math.max(-6, Math.min(6, window.scrollY * 0.018));
      const phase = reduced.matches ? 0 : time * 0.0004;

      for (let y = -PITCH; y < height + PITCH; y += PITCH) {
        for (let x = -PITCH; x < width + PITCH; x += PITCH) {
          const wave = 0.5 + Math.sin(phase + x * 0.006 + y * 0.004) * 0.5;
          const amount = 0.08 + wave * 0.16;

          context.fillStyle = `rgb(${mix(BASE[0], DIM[0], amount)}, ${mix(BASE[1], DIM[1], amount)}, ${mix(BASE[2], DIM[2], amount)})`;
          context.beginPath();
          context.arc(x + scrollDrift, y - scrollDrift * 0.35, 1.1 * dpr, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const tick = (time: number) => {
      draw(time);

      if (running && !document.hidden && !reduced.matches) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };

    const start = () => {
      running = true;
      window.cancelAnimationFrame(frame);
      resize();

      if (!document.hidden && !reduced.matches) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(frame);

      if (!document.hidden && !reduced.matches) {
        frame = window.requestAnimationFrame(tick);
      } else {
        draw(performance.now());
      }
    };

    start();
    window.addEventListener("resize", scheduleResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
