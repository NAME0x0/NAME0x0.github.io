"use client";

import { useEffect, useState, type ComponentType } from "react";
import { checkFilmGate } from "@/lib/film/gate";

export function FluidInkMount() {
  const [FluidInk, setFluidInk] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const idleId = ("requestIdleCallback" in window
      ? window.requestIdleCallback(async () => {
        const finePointer = window.matchMedia("(pointer: fine)").matches;

        if (!finePointer || !(await checkFilmGate()) || cancelled) {
          return;
        }

        const fluidInkModule = await import("./FluidInk");

        if (!cancelled) {
          setFluidInk(() => fluidInkModule.FluidInk);
        }
      })
      : globalThis.setTimeout(async () => {
      const finePointer = window.matchMedia("(pointer: fine)").matches;

      if (!finePointer || !(await checkFilmGate()) || cancelled) {
        return;
      }

      const fluidInkModule = await import("./FluidInk");

      if (!cancelled) {
        setFluidInk(() => fluidInkModule.FluidInk);
      }
    }, 200)) as unknown as number;

    return () => {
      cancelled = true;

      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
    };
  }, []);

  return FluidInk ? <FluidInk /> : null;
}
