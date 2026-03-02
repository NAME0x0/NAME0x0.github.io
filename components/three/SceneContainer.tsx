"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { KineticWall } from "@/components/three/KineticWall";
import { VoidParticles } from "@/components/three/VoidParticles";
import { WaveSurface } from "@/components/three/WaveSurface";
import { usePerformanceTier } from "@/lib/hooks/usePerformanceTier";
import {
  computeSceneParams,
  WALL_ROWS_DESKTOP,
  WALL_ROWS_TABLET,
  WALL_ROWS_MOBILE,
  type SceneParams,
} from "@/lib/scene/sceneConfig";

export interface SceneContainerProps {
  scrollProgressRef: RefObject<number>;
  mousePosRef: RefObject<[number, number]>;
}

interface SceneDriverProps {
  scrollProgressRef: RefObject<number>;
  mousePosRef: RefObject<[number, number]>;
  particleCount: number;
  waveSegments: number;
  wallRows: number;
}

function SceneDriver({
  scrollProgressRef,
  mousePosRef,
  particleCount,
  waveSegments,
  wallRows,
}: SceneDriverProps) {
  const paramsRef = useRef<SceneParams>({
    particleOpacity: 1,
    particleSpeed: 1,
    wallOpacity: 1,
    wallEnergy: 1,
    wallRevealTarget: 1,
    waveOpacity: 0,
    waveAmplitude: 0,
  });

  const particleOpacityRef = useRef(1);
  const particleSpeedRef = useRef(1);
  const wallOpacityRef = useRef(1);
  const wallEnergyRef = useRef(1);
  const wallRevealRef = useRef(1);
  const waveOpacityRef = useRef(0);
  const waveAmplitudeRef = useRef(0);
  const scrollYRef = useRef(0);
  const mousePosPassRef = useRef<[number, number]>([0, 0]);

  useFrame(() => {
    const scroll = scrollProgressRef.current ?? 0;
    const params = computeSceneParams(scroll);
    paramsRef.current = params;

    // Update values for children to read
    particleOpacityRef.current = params.particleOpacity;
    particleSpeedRef.current = params.particleSpeed;
    wallOpacityRef.current = params.wallOpacity;
    wallEnergyRef.current = params.wallEnergy;
    wallRevealRef.current = params.wallRevealTarget;
    waveOpacityRef.current = params.waveOpacity;
    waveAmplitudeRef.current = params.waveAmplitude;
    scrollYRef.current = -scroll * 1.5;
    mousePosPassRef.current = mousePosRef.current ?? [0, 0];
  });

  return (
    <>
      <VoidParticles
        count={particleCount}
        globalOpacityRef={particleOpacityRef}
        speedScaleRef={particleSpeedRef}
        scrollYRef={scrollYRef}
      />
      <KineticWall
        globalOpacityRef={wallOpacityRef}
        energyRef={wallEnergyRef}
        revealTargetRef={wallRevealRef}
        mousePosRef={mousePosPassRef}
        wallRows={wallRows}
      />
      <WaveSurface
        segments={waveSegments}
        globalOpacityRef={waveOpacityRef}
        amplitudeRef={waveAmplitudeRef}
      />
    </>
  );
}

export function SceneContainer({
  scrollProgressRef,
  mousePosRef,
}: SceneContainerProps) {
  const { tier, config } = usePerformanceTier();

  if (tier === "reduced" || config.disabled) {
    return (
      <div
        className="kinetic-wall-fallback"
        aria-hidden="true"
      />
    );
  }

  const wallRows =
    tier === "desktop"
      ? WALL_ROWS_DESKTOP
      : tier === "tablet"
        ? WALL_ROWS_TABLET
        : WALL_ROWS_MOBILE;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <Canvas
        gl={{
          antialias: false,
          stencil: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={config.dpr}
        style={{ background: "transparent" }}
        resize={{ scroll: false }}
      >
        <SceneDriver
          scrollProgressRef={scrollProgressRef}
          mousePosRef={mousePosRef}
          particleCount={config.particleCount}
          waveSegments={config.waveSegments}
          wallRows={wallRows}
        />
      </Canvas>
    </div>
  );
}

export default SceneContainer;
