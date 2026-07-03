"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { filmProgressStore, useFilmProgressEngine } from "@/lib/film/progress";
import { Machine } from "./scenes/Machine";

function Environment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room).texture;
    const previousEnvironment = scene.environment;

    scene.environment = envMap;

    return () => {
      scene.environment = previousEnvironment;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

export function FilmCanvas() {
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);
  const [documentHidden, setDocumentHidden] = useState(
    typeof document !== "undefined" && document.hidden,
  );
  const [coveredByPaper, setCoveredByPaper] = useState(false);
  const frameloop = documentHidden || coveredByPaper ? "never" : "always";

  useFilmProgressEngine();

  useEffect(() => {
    const onVisibilityChange = () => {
      setDocumentHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => filmProgressStore.subscribe((progress) => {
    const nextCovered = progress.chapter === 7 && progress.chapterLocal > 0.6;

    setCoveredByPaper((current) => current === nextCovered ? current : nextCovered);
  }), []);

  return (
    <div className="film-canvas-wrapper" aria-hidden="true">
      <Canvas
        camera={{ position: [1.2, 4.2, 7], fov: 35, near: 0.1, far: 30 }}
        dpr={dpr}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Environment />
        <Machine />
      </Canvas>
    </div>
  );
}
