"use client";

import dynamic from "next/dynamic";

const ScrollFX = dynamic(() => import("./ScrollFX").then((module) => module.ScrollFX), { ssr: false });

export function ScrollFXMount() {
  return <ScrollFX />;
}
