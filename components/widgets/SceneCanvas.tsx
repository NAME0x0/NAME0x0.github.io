"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import type { CanvasTexture } from "three";
import type { WidgetScene } from "./SceneWidget";
import { BarsScene } from "./scenes/BarsScene";
import { CouncilScene } from "./scenes/CouncilScene";
import { ReactorScene } from "./scenes/ReactorScene";
import { StarsScene } from "./scenes/StarsScene";
import { TorusScene } from "./scenes/TorusScene";
import { createGlowTexture, smoothstep } from "./scenes/shared";
import type { WidgetSceneData } from "./SceneWidget";

type SceneCanvasProps = {
  scene: WidgetScene;
  active: boolean;
  data?: WidgetSceneData;
};

export type WidgetSceneProps = {
  entryRef: MutableRefObject<number>;
  glowTexture: CanvasTexture;
  data?: WidgetSceneData;
};

function CameraSetup({ scene }: { scene: WidgetScene }) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (scene === "reactor") {
      camera.position.set(0, 0.45, 4.15);
      camera.lookAt(0, 0, 0);
    } else if (scene === "torus") {
      camera.position.set(0.18, 1.25, 4.15);
      camera.lookAt(0.18, 1.05, 0);
    } else if (scene === "stars") {
      camera.position.set(0, 1.2, 4);
      camera.lookAt(0.3, 1.25, 0);
    } else {
      camera.position.set(0, 0.95, 4);
      camera.lookAt(0, 0.65, 0);
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

function SceneContent({ scene, active, data }: SceneCanvasProps) {
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
      {scene === "reactor" ? <ReactorScene entryRef={entryRef} glowTexture={glowTexture} data={data} /> : null}
    </>
  );
}

export function SceneCanvas({ scene, active, data }: SceneCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.95, 4], fov: 34, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContent scene={scene} active={active} data={data} />
    </Canvas>
  );
}
