"use client";

import { Canvas } from "@react-three/fiber";
import { KineticWall } from "@/components/three/KineticWall";
import { VoidParticles } from "@/components/three/VoidParticles";
import { WaveSurface } from "@/components/three/WaveSurface";
import { usePerformanceTier } from "@/lib/hooks/usePerformanceTier";

export interface SceneContainerProps {
  scrollProgress: number;
  activeSection: string;
  mousePosition: [number, number];
}

function clamp01(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

export function SceneContainer({
  scrollProgress,
  activeSection,
  mousePosition,
}: SceneContainerProps) {
  const { tier, config } = usePerformanceTier();

  if (tier === "reduced" || config.disabled) {
    // CSS-only fallback: subtle grid pattern evokes the kinetic wall
    return (
      <div
        className="kinetic-wall-fallback"
        aria-hidden="true"
      />
    );
  }

  const clampedScroll = clamp01(scrollProgress);
  const isContactSection = activeSection === "contact" || clampedScroll > 0.82;
  const particlesVisible = clampedScroll < 0.96;
  const wallVisible = !isContactSection && clampedScroll < 0.8;
  const wallProgress = clamp01((clampedScroll - 0.02) / 0.45);

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
        <VoidParticles
          count={config.particleCount}
          scrollY={-clampedScroll * 1.5}
          visible={particlesVisible}
        />
        <KineticWall
          progress={wallVisible ? wallProgress : 0}
          mousePosition={mousePosition}
          visible={wallVisible}
        />
        <WaveSurface segments={config.waveSegments} visible={isContactSection} />
      </Canvas>
    </div>
  );
}

export default SceneContainer;

