"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import type { CanvasTexture } from "three";
import type { WidgetScene } from "./SceneWidget";
import { BarsScene } from "./scenes/BarsScene";
import { CouncilScene } from "./scenes/CouncilScene";
import { StarsScene } from "./scenes/StarsScene";
import { TorusScene } from "./scenes/TorusScene";
import { createGlowTexture, smoothstep } from "./scenes/shared";

type SceneCanvasProps = {
  scene: WidgetScene;
  active: boolean;
};

export type WidgetSceneProps = {
  entryRef: MutableRefObject<number>;
  glowTexture: CanvasTexture;
};

function CameraSetup({ scene }: { scene: WidgetScene }) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (scene === "torus") {
      camera.position.set(0.25, 2.1, 5.7);
      camera.lookAt(0.25, 1.15, 0);
    } else if (scene === "stars") {
      camera.position.set(0, 1.5, 5.4);
      camera.lookAt(0.55, 1.3, 0);
    } else {
      camera.position.set(0, 1.8, 5.2);
      camera.lookAt(0, 1.0, 0);
    }
  }, [camera, scene]);

  return null;
}

function EntryProgress({ active, entryRef }: { active: boolean; entryRef: MutableRefObject<number> }) {
  const rawEntryRef = useRef(0);

  useFrame((_, delta) => {
    if (!active || rawEntryRef.current >= 1) {
      return;
    }

    rawEntryRef.current = Math.min(1, rawEntryRef.current + delta / 1.4);
    entryRef.current = smoothstep(rawEntryRef.current);
  });

  return null;
}

function SceneContent({ scene, active }: SceneCanvasProps) {
  const entryRef = useRef(0);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  useEffect(() => () => {
    glowTexture.dispose();
  }, [glowTexture]);

  return (
    <>
      <CameraSetup scene={scene} />
      <EntryProgress active={active} entryRef={entryRef} />
      {scene === "bars" ? <BarsScene entryRef={entryRef} glowTexture={glowTexture} /> : null}
      {scene === "council" ? <CouncilScene entryRef={entryRef} glowTexture={glowTexture} /> : null}
      {scene === "torus" ? <TorusScene entryRef={entryRef} glowTexture={glowTexture} /> : null}
      {scene === "stars" ? <StarsScene entryRef={entryRef} glowTexture={glowTexture} /> : null}
    </>
  );
}

export function SceneCanvas({ scene, active }: SceneCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.8, 5.2], fov: 38, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContent scene={scene} active={active} />
    </Canvas>
  );
}
