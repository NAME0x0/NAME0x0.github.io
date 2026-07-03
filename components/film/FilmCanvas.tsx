"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useFilmProgressEngine } from "@/lib/film/progress";
import { Die } from "./scenes/Die";

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
  const [frameloop, setFrameloop] = useState<"always" | "never">(
    typeof document !== "undefined" && document.hidden ? "never" : "always",
  );

  useFilmProgressEngine();

  useEffect(() => {
    const onVisibilityChange = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

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
        <Die />
      </Canvas>
    </div>
  );
}
