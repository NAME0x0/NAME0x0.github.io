"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
};

export function Magnetic({ children }: MagneticProps) {
  const [MotionMagnetic, setMotionMagnetic] = useState<ComponentType<MagneticProps> | null>(null);

  useEffect(() => {
    let mounted = true;

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
