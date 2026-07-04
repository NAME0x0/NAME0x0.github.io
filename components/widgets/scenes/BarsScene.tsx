"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
} from "three";
import type { WidgetSceneProps } from "../SceneCanvas";
import { BONE, DIM, SIGNAL, smoothstep } from "./shared";

const BENCHMARKS = [
  { label: "ARC-C 82.0", value: 0.82, x: -0.72, z: -0.36, width: 0.14, color: SIGNAL },
  { label: "ARC-E 92.0", value: 0.92, x: 0, z: 0, width: 0.16, color: SIGNAL },
  { label: "Llama 3.2 78.6", value: 0.786, x: 0.72, z: 0.36, width: 0.1, color: DIM },
] as const;

function createLabelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 192;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "700 92px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.fillText(text, 512, 96);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

export function BarsScene({ entryRef, glowTexture }: WidgetSceneProps) {
  const columnsRef = useRef<(Mesh | null)[]>([]);
  const coresRef = useRef<(Mesh | null)[]>([]);
  const basesRef = useRef<(Sprite | null)[]>([]);
  const labelsRef = useRef<(Sprite | null)[]>([]);
  const labelTextures = useMemo(
    () => BENCHMARKS.map((benchmark) => createLabelTexture(benchmark.label, benchmark.color)),
    [],
  );

  useEffect(() => () => {
    labelTextures.forEach((texture) => texture.dispose());
  }, [labelTextures]);

  useFrame(({ clock }) => {
    const entry = entryRef.current;
    const time = clock.elapsedTime;

    for (let index = 0; index < BENCHMARKS.length; index += 1) {
      const benchmark = BENCHMARKS[index];
      const column = columnsRef.current[index];
      const core = coresRef.current[index];
      const base = basesRef.current[index];
      const label = labelsRef.current[index];
      const grow = smoothstep((entry - index * 0.12) / 0.74);
      const shimmer = 0.88 + Math.sin(time * 1.7 + index * 1.9) * 0.12;
      const height = Math.min(benchmark.value * 2.3, 2.25) * grow;
      const opacity = 0.58 * grow * shimmer;

      if (column) {
        column.position.y = -0.9 + height * 0.5;
        column.scale.y = Math.max(height, 0.001);
        (column.material as MeshBasicMaterial).opacity = opacity;
      }

      if (core) {
        core.position.y = -0.9 + height * 0.5;
        core.scale.y = Math.max(height, 0.001);
        (core.material as MeshBasicMaterial).opacity = opacity * 0.9;
      }

      if (base) {
        (base.material as SpriteMaterial).opacity = 0.42 * grow;
      }

      if (label) {
        label.position.y = -0.5 + height + index * 0.28;
        (label.material as SpriteMaterial).opacity = grow;
      }
    }
  });

  return (
    <group rotation={[-0.08, -0.18, 0]} position={[0, 0.36, 0]} scale={1.18}>
      {BENCHMARKS.map((benchmark, index) => (
        <group key={benchmark.label} position={[benchmark.x, 0, benchmark.z]}>
          <mesh ref={(node) => { columnsRef.current[index] = node; }} scale={[benchmark.width, 0.001, benchmark.width]} position={[0, -0.9, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={benchmark.color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh ref={(node) => { coresRef.current[index] = node; }} scale={[benchmark.width * 0.28, 0.001, benchmark.width * 0.28]} position={[0, -0.9, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={BONE} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <sprite ref={(node) => { basesRef.current[index] = node; }} position={[0, -0.9, 0]} scale={[0.74, 0.74, 1]}>
            <spriteMaterial map={glowTexture} color={benchmark.color} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
          </sprite>
          <sprite ref={(node) => { labelsRef.current[index] = node; }} position={[0.08 + index * 0.08, -0.56, 0]} scale={[1.28, 0.24, 1]}>
            <spriteMaterial map={labelTextures[index]} transparent opacity={0} depthWrite={false} />
          </sprite>
        </group>
      ))}
    </group>
  );
}
