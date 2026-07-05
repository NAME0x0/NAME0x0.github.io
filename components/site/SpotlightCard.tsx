"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

const initialStyle = {
  "--spot-x": "50%",
  "--spot-y": "50%",
} as CSSProperties;

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  function onMouseMove(event: MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <article
      onMouseMove={onMouseMove}
      style={initialStyle}
      className={`spotlight-card relative overflow-hidden border border-faint ${className}`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" />
      {children}
    </article>
  );
}
