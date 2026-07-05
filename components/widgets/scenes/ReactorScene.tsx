"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
} from "three";
import type { WidgetSceneProps } from "../SceneCanvas";
import { BONE, DIM, SIGNAL, smoothstep, smoothstepRange } from "./shared";

const RINGS = [
  { rx: 0.88, ry: 0.36, speed: 0.12 },
  { rx: 1.22, ry: 0.54, speed: -0.09 },
  { rx: 1.58, ry: 0.72, speed: 0.065 },
] as const;
const CLAIM_COUNT = 14;

function createLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "700 52px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = BONE;
    ctx.fillText(text, 256, 64);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

export function ReactorScene({ entryRef, glowTexture, data = [] }: WidgetSceneProps) {
  const coreRef = useRef<Sprite>(null);
  const pulseRef = useRef<Sprite>(null);
  const finalRingRef = useRef<Mesh>(null);
  const moteRefs = useRef<(Sprite | null)[]>([]);
  const labelRefs = useRef<(Sprite | null)[]>([]);
  const sequenceRef = useRef(0);
  const currentPositions = useMemo(() => new Float32Array(CLAIM_COUNT * 3), []);
  const claims = useMemo(() => data.slice(0, CLAIM_COUNT), [data]);
  const labels = useMemo(() => claims.map((claim) => createLabelTexture(claim.value)), [claims]);
  const signalColor = useMemo(() => new Color(SIGNAL), []);
  const boneColor = useMemo(() => new Color(BONE), []);
  const dimColor = useMemo(() => new Color(DIM), []);

  useEffect(() => () => {
    labels.forEach((texture) => texture.dispose());
  }, [labels]);

  useFrame(({ clock }, delta) => {
    const core = coreRef.current;
    const pulse = pulseRef.current;
    const finalRing = finalRingRef.current;
    const entry = entryRef.current;

    if (!core || !pulse || !finalRing || entry <= 0.001) {
      return;
    }

    sequenceRef.current = Math.min(1, sequenceRef.current + delta / 4);

    const time = clock.elapsedTime;
    const sequenceSeconds = sequenceRef.current * 4;
    const heartbeat = Math.max(0, Math.sin((time % 5) / 5 * Math.PI * 2)) ** 8;
    const coreFlare = smoothstepRange(0, 0.22, sequenceSeconds) * (1 - smoothstepRange(0.5, 0.85, sequenceSeconds));

    core.scale.setScalar((0.22 + heartbeat * 0.12 + coreFlare * 0.28) * entry);
    (core.material as SpriteMaterial).opacity = (0.62 + heartbeat * 0.26 + coreFlare * 0.34) * entry;

    for (let index = 0; index < CLAIM_COUNT; index += 1) {
      const claim = claims[index];
      const mote = moteRefs.current[index];
      const label = labelRefs.current[index];
      const ring = RINGS[index % RINGS.length];
      const stampAt = 0.32 + index * 0.22;
      const arrival = smoothstepRange(stampAt, stampAt + 0.16, sequenceSeconds);
      const stamped = sequenceSeconds >= stampAt + 0.14;
      const verified = claim?.status === "verified";
      const angle = index * 1.74 + (index % 3) * 0.42 + time * ring.speed;
      const offset = index * 3;
      const x = Math.cos(angle) * ring.rx;
      const y = Math.sin(angle) * ring.ry;
      const z = Math.sin(angle * 0.73 + index) * 0.18;
      const twinkle = 0.86 + Math.sin(time * 1.7 + index * 0.9) * 0.14;
      const color = verified ? signalColor : dimColor;

      currentPositions[offset] = x;
      currentPositions[offset + 1] = y;
      currentPositions[offset + 2] = z;

      if (mote) {
        mote.position.set(x, y, z);
        mote.scale.setScalar((0.18 + arrival * 0.18) * entry);
        (mote.material as SpriteMaterial).opacity = (0.28 + arrival * 0.58) * twinkle * entry;
        (mote.material as SpriteMaterial).color.copy(stamped ? color : boneColor);
      }

      if (label) {
        label.position.set(x, y - 0.18, z);
        label.scale.set(0.48, 0.12, 1);
        (label.material as SpriteMaterial).opacity = (stamped ? 0.86 : 0.24) * entry;
        (label.material as SpriteMaterial).color.copy(stamped ? color : dimColor);
      }
    }

    const activeIndex = Math.floor((sequenceSeconds - 0.32) / 0.22);

    if (activeIndex >= 0 && activeIndex < CLAIM_COUNT) {
      const local = smoothstep((sequenceSeconds - (0.32 + activeIndex * 0.22)) / 0.18);
      const offset = activeIndex * 3;
      const verified = claims[activeIndex]?.status === "verified";

      pulse.visible = true;
      pulse.position.set(
        currentPositions[offset] * local,
        currentPositions[offset + 1] * local,
        currentPositions[offset + 2] * local,
      );
      pulse.scale.setScalar(0.22 + Math.sin(local * Math.PI) * 0.2);
      (pulse.material as SpriteMaterial).opacity = Math.sin(local * Math.PI) * 0.82 * entry;
      (pulse.material as SpriteMaterial).color.copy(verified ? signalColor : dimColor);
    } else {
      pulse.visible = false;
    }

    const ringIn = smoothstepRange(3.62, 4, sequenceSeconds);
    const ringMaterial = finalRing.material as MeshBasicMaterial;

    finalRing.scale.setScalar(0.82 + ringIn * 0.18 + heartbeat * 0.025);
    ringMaterial.opacity = ringIn * (0.34 + heartbeat * 0.18) * entry;
  });

  return (
    <group position={[0, 0.04, 0]} scale={1.12}>
      <sprite ref={coreRef} scale={[0.22, 0.22, 1]}>
        <spriteMaterial map={glowTexture} color={SIGNAL} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite ref={pulseRef} visible={false} scale={[0.22, 0.22, 1]}>
        <spriteMaterial map={glowTexture} color={SIGNAL} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      {claims.map((claim, index) => (
        <group key={claim.id}>
          <sprite ref={(node) => { moteRefs.current[index] = node; }} scale={[0.18, 0.18, 1]}>
            <spriteMaterial map={glowTexture} color={BONE} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
          </sprite>
          <sprite ref={(node) => { labelRefs.current[index] = node; }} scale={[0.48, 0.12, 1]}>
            <spriteMaterial map={labels[index]} color={DIM} transparent opacity={0} depthWrite={false} />
          </sprite>
        </group>
      ))}
      <mesh ref={finalRingRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.82, 0.006, 8, 96]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
