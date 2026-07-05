"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { filmProgressStore, useFilmProgress } from "@/lib/film/progress";
import { AmbientField } from "./AmbientField";
import { Council } from "./Council";
import { Torus } from "./Torus";
import { sampleRail, narrowRail, wideRail, type RailSample } from "./rail";
import { layerPresence, smoothstep } from "./staging";

const SIGNAL = "#E3B341";
const DIM = "#8A8578";
const EMBER = "#D08C5A";
const BONE = "#C4B5A0";

const BENCHMARKS = [
  { label: "ARC-C 82.0", value: 0.82, x: -0.55, z: -0.52, width: 0.13, color: SIGNAL },
  { label: "ARC-E 92.0", value: 0.92, x: 0, z: 0, width: 0.15, color: SIGNAL },
  { label: "Llama 3.2 78.6", value: 0.786, x: 0.55, z: 0.52, width: 0.08, color: DIM },
] as const;

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 124);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  gradient.addColorStop(0.24, "rgba(255, 255, 255, 0.48)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

function createLabelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "700 54px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 64);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

export function Machine() {
  const groupRef = useRef<Group>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const fillLightRef = useRef<DirectionalLight>(null);
  const rimLightRef = useRef<PointLight>(null);
  const cyanLightRef = useRef<PointLight>(null);
  const columnsRef = useRef<(Mesh | null)[]>([]);
  const coresRef = useRef<(Mesh | null)[]>([]);
  const basesRef = useRef<(Sprite | null)[]>([]);
  const labelsRef = useRef<(Sprite | null)[]>([]);
  const progressRef = useRef(filmProgressStore.getSnapshot());
  const store = useFilmProgress();
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);
  const targetPosition = useMemo(() => new Vector3(), []);
  const cameraPosition = useMemo(() => new Vector3(), []);
  const cameraTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const wideStage = useMemo(() => new Vector3(2.5, 0, 0), []);
  const narrowStage = useMemo(() => new Vector3(0, -1.6, 0), []);
  const railSample = useMemo<RailSample>(() => ({
    cameraPosition: new Vector3(),
    lookAt: new Vector3(),
  }), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const labelTextures = useMemo(
    () => BENCHMARKS.map((benchmark) => createLabelTexture(benchmark.label, benchmark.color)),
    [],
  );

  useEffect(() => store.subscribe((progress) => {
    progressRef.current = progress;
  }), [store]);

  useEffect(() => () => {
    glowTexture.dispose();
    labelTextures.forEach((texture) => texture.dispose());
  }, [glowTexture, labelTextures]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const ambientLight = ambientLightRef.current;
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const rimLight = rimLightRef.current;
    const cyanLight = cyanLightRef.current;

    if (!group || !ambientLight || !keyLight || !fillLight || !rimLight || !cyanLight) {
      return;
    }

    const { chapter, chapterLocal } = progressRef.current;
    const mindPresence = layerPresence(chapter, chapterLocal, 3);
    const powerDown = chapter === 7 ? smoothstep(chapterLocal / 0.5) : 0;
    const lightScale = 1 - powerDown * 0.35;
    const isNarrow = viewport.width / Math.max(viewport.height, 0.001) < 1.05;
    const activeStage = isNarrow ? narrowStage : wideStage;
    const damping = 1 - Math.pow(0.001, delta);
    const track = isNarrow ? narrowRail : wideRail;

    sampleRail(track, chapter, chapterLocal, railSample);

    targetPosition.copy(activeStage);
    group.position.lerp(targetPosition, damping);
    ambientLight.intensity = 0.22 * lightScale;
    keyLight.intensity = 3.1 * lightScale;
    fillLight.intensity = 0.58 * lightScale;
    rimLight.intensity = 1.9 * lightScale;
    cyanLight.intensity = 1.05 * lightScale;

    cameraPosition.set(
      group.position.x + railSample.cameraPosition.x,
      group.position.y + railSample.cameraPosition.y,
      group.position.z + railSample.cameraPosition.z,
    );
    camera.position.lerp(cameraPosition, damping);
    cameraTarget.set(
      group.position.x + railSample.lookAt.x,
      group.position.y + railSample.lookAt.y,
      group.position.z + railSample.lookAt.z,
    );
    camera.lookAt(cameraTarget);

    for (let index = 0; index < BENCHMARKS.length; index += 1) {
      const benchmark = BENCHMARKS[index];
      const column = columnsRef.current[index];
      const core = coresRef.current[index];
      const base = basesRef.current[index];
      const label = labelsRef.current[index];
      const grow = smoothstep((mindPresence - index * 0.1) / 0.72);
      const height = Math.min(benchmark.value * 2.6, 2.4) * grow;
      const opacity = 0.55 * grow * mindPresence;

      if (column) {
        column.position.y = 0.1 + height * 0.5;
        column.scale.y = Math.max(height, 0.001);
        (column.material as MeshBasicMaterial).opacity = opacity;
      }

      if (core) {
        core.position.y = 0.1 + height * 0.5;
        core.scale.y = Math.max(height, 0.001);
        (core.material as MeshBasicMaterial).opacity = opacity * 0.88;
      }

      if (base) {
        (base.material as SpriteMaterial).opacity = 0.42 * grow * mindPresence;
      }

      if (label) {
        label.position.y = 0.42 + height + index * 0.16;
        (label.material as SpriteMaterial).opacity = 0.82 * grow * mindPresence;
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.22} />
      <directionalLight ref={keyLightRef} position={[1.8, 5, 3.5]} intensity={3.1} color="#f2ede4" />
      <directionalLight ref={fillLightRef} position={[0, 2.4, 5.2]} intensity={0.58} color="#e8e4de" />
      <pointLight ref={rimLightRef} position={[4.4, 1.8, -2.2]} intensity={1.9} color={EMBER} />
      <pointLight ref={cyanLightRef} position={[3.4, 2.3, 2.8]} intensity={1.05} color="#5bb9d2" />
      <group ref={groupRef} position={[2.5, 0, 0]}>
        <AmbientField progressRef={progressRef} glowTexture={glowTexture} />
        {BENCHMARKS.map((benchmark, index) => (
          <group key={benchmark.label} position={[benchmark.x, -0.9, benchmark.z]}>
            <mesh ref={(node) => { columnsRef.current[index] = node; }} scale={[benchmark.width, 0.001, benchmark.width]} position={[0, 0.1, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh ref={(node) => { coresRef.current[index] = node; }} scale={[benchmark.width * 0.28, 0.001, benchmark.width * 0.28]} position={[0, 0.1, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <sprite ref={(node) => { basesRef.current[index] = node; }} scale={[0.74, 0.74, 1]} rotation={[0, 0, 0]}>
              <spriteMaterial
                map={glowTexture}
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
            <sprite ref={(node) => { labelsRef.current[index] = node; }} position={[0.1 + index * 0.08, 0.34, 0]} scale={[0.58, 0.16, 1]}>
              <spriteMaterial
                map={labelTextures[index]}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </sprite>
          </group>
        ))}
        <Council progressRef={progressRef} glowTexture={glowTexture} />
        <Torus progressRef={progressRef} glowTexture={glowTexture} />
      </group>
    </>
  );
}
