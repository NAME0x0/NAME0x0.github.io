"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import type { CanvasTexture, PerspectiveCamera } from "three";
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

const CAMERA_FOV = 34;
const FIT_MARGIN = 0.12;
const SCENE_BOUNDS: Record<WidgetScene, { center: readonly [number, number, number]; radius: number }> = {
  bars: { center: [0, 0.75, 0], radius: 1.95 },
  council: { center: [0, 1.05, 0], radius: 2.1 },
  torus: { center: [0.05, 1.12, 0], radius: 2.25 },
  stars: { center: [0, 1.15, 0], radius: 3.15 },
  reactor: { center: [0, 0, 0], radius: 2.25 },
};

export type WidgetSceneProps = {
  entryRef: MutableRefObject<number>;
  glowTexture: CanvasTexture;
  data?: WidgetSceneData;
};

function CameraSetup({ scene }: { scene: WidgetScene }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const perspective = camera as PerspectiveCamera;
    const bounds = SCENE_BOUNDS[scene];
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.01);
    const verticalHalfFov = (perspective.fov * Math.PI / 180) * 0.5;
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * aspect);
    const strictHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
    const distance = bounds.radius / (Math.sin(strictHalfFov) * (1 - FIT_MARGIN));
    const [x, y, z] = bounds.center;

    perspective.position.set(x, y, z + distance);
    perspective.lookAt(x, y, z);
    perspective.updateProjectionMatrix();
  }, [camera, scene, size.height, size.width]);

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
      camera={{ position: [0, 0.95, 4], fov: CAMERA_FOV, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContent scene={scene} active={active} data={data} />
    </Canvas>
  );
}
