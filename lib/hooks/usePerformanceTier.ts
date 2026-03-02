"use client";

import { useEffect, useRef, useState } from "react";

export type PerfTier = "desktop" | "tablet" | "mobile" | "reduced";

export interface TierConfig {
  dpr: number;
  /** Reserved for future dot-matrix background density. */
  dotCount: number;
  particleCount: number;
  waveSegments: number;
  disabled?: boolean;
}

const TIER_CONFIGS: Record<PerfTier, TierConfig> = {
  desktop: { dpr: 2, dotCount: 2000, particleCount: 200, waveSegments: 128 },
  tablet: { dpr: 1.5, dotCount: 1000, particleCount: 120, waveSegments: 64 },
  mobile: { dpr: 1, dotCount: 500, particleCount: 60, waveSegments: 32 },
  reduced: { dpr: 1, dotCount: 0, particleCount: 0, waveSegments: 0, disabled: true },
};

const RESIZE_DEBOUNCE_MS = 300;

function detectTier(): PerfTier {
  if (typeof window === "undefined") {
    return "mobile";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }

  if (window.innerWidth >= 1024) {
    return "desktop";
  }

  if (window.innerWidth >= 768) {
    return "tablet";
  }

  return "mobile";
}

function resolveConfig(tier: PerfTier): TierConfig {
  const baseConfig = TIER_CONFIGS[tier];

  if (typeof window === "undefined") {
    return baseConfig;
  }

  return {
    ...baseConfig,
    dpr: Math.min(window.devicePixelRatio || 1, baseConfig.dpr),
  };
}

export function usePerformanceTier(): { tier: PerfTier; config: TierConfig } {
  const cachedTierRef = useRef<PerfTier | null>(null);
  const [state, setState] = useState<{ tier: PerfTier; config: TierConfig }>({
    tier: "mobile",
    config: TIER_CONFIGS.mobile,
  });

  useEffect(() => {
    const update = () => {
      const detectedTier = detectTier();
      cachedTierRef.current = detectedTier;
      setState({
        tier: detectedTier,
        config: resolveConfig(detectedTier),
      });
    };

    update();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        const newTier = detectTier();
        if (newTier !== cachedTierRef.current) {
          update();
        }
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return state;
}
