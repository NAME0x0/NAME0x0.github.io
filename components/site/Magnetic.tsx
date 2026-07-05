"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
};

export function Magnetic({ children }: MagneticProps) {
  const [MotionMagnetic, setMotionMagnetic] = useState<ComponentType<MagneticProps> | null>(null);

  useEffect(() => {
    let mounted = true;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reduced) {
      return () => {
        mounted = false;
      };
    }

    void import("./MagneticMotion").then((module) => {
      if (mounted) {
        setMotionMagnetic(() => module.MagneticMotion);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!MotionMagnetic) {
    return children;
  }

  return <MotionMagnetic>{children}</MotionMagnetic>;
}
