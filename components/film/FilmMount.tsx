"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ModelEntry } from "detect-gpu";

const FilmCanvas = dynamic(() => import("./FilmCanvas").then((module) => module.FilmCanvas), {
  ssr: false,
});

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

function supportsWebGL2() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    powerPreference: "high-performance",
  });

  if (!gl) {
    return false;
  }

  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

function getLocalBenchmarkRows(file: string): ModelEntry[] {
  const isMobile = file.startsWith("m-");
  const fps = isMobile ? 64 : 72;
  const family = file.replace(/^(d|m)-/, "").replace("-ipad", "").replace(".json", "");
  const versionsByFamily: Record<string, string[]> = {
    adreno: ["530", "540", "615", "630", "640", "650", "660", "730", "740", "750", ""],
    amd: ["460", "470", "480", "550", "560", "570", "580", "5500", "5600", "5700", "6600", "6700", "6800", "6900", "7600", "7700", "7800", "7900", ""],
    apple: ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "1", "2", "3", "4", ""],
    geforce: ["1050", "1060", "1070", "1080", "1650", "1660", "2060", "2070", "2080", "3050", "3060", "3070", "3080", "3090", "4050", "4060", "4070", "4080", "4090", ""],
    intel: ["4000", "4400", "4600", "5000", "510", "520", "530", "540", "550", "620", "630", "640", "655", "xe", "arc", ""],
    "mali-t": ["760", "860", "880", ""],
    mali: ["g52", "g57", "g68", "g71", "g72", "g76", "g77", "g78", "g710", "g715", "g720", ""],
    nvidia: ["1050", "1060", "1070", "1080", "1650", "1660", "2060", "2070", "2080", "3050", "3060", "3070", "3080", "3090", "4050", "4060", "4070", "4080", "4090", ""],
    powervr: ["rogue", ""],
    radeon: ["460", "470", "480", "550", "560", "570", "580", "5500", "5600", "5700", "6600", "6700", "6800", "6900", "7600", "7700", "7800", "7900", ""],
    samsung: ["920", "940", ""],
  };
  const versions = versionsByFamily[family] ?? [""];
  const rows = versions.map<ModelEntry>((version) => [
    `${family} ${version}`.trim(),
    version,
    `${family} graphics ${version}`.trim(),
    0,
    [
      [1280, 720, fps, `${family} local`],
      [1920, 1080, fps, `${family} local`],
      [2560, 1440, fps - 8, `${family} local`],
      [3840, 2160, fps - 18, `${family} local`],
    ],
  ]);

  return ["4.0.0" as unknown as ModelEntry, ...rows];
}

export function FilmMount() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkGate() {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

      if (prefersReducedMotion || saveData || !supportsWebGL2()) {
        return;
      }

      // QA override: bypasses the GPU-tier check only (WebGL2 + reduced-motion +
      // saveData still gate). Headless test browsers report SwiftShader and would
      // otherwise never exercise the film; also used for cross-device QA.
      if (new URLSearchParams(window.location.search).get("film") === "force") {
        if (!cancelled) {
          setEnabled(true);
        }
        return;
      }

      const { getGPUTier } = await import("detect-gpu");
      const tier = await getGPUTier({
        override: {
          loadBenchmarks: async (file) => getLocalBenchmarkRows(file),
        },
      });
      const requiredTier = tier.isMobile ? 3 : 2;

      if (!cancelled && tier.tier >= requiredTier) {
        setEnabled(true);
      }
    }

    void checkGate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    document.body.dataset.film = "on";

    return () => {
      delete document.body.dataset.film;
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <FilmCanvas />;
}
