"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  MeshBasicMaterial,
  Object3D,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import type { WidgetSceneProps } from "../SceneCanvas";
import { BONE, DIM, EMBER, SIGNAL, smoothstep, smoothstepRange } from "./shared";

const NODE_COUNT = 11;
const ARC_COUNT = 8;
const ARC_POINTS = 18;
const RING_RADIUS = 1.22;
const RING_Y = 1.05;

const arcPairs = [
  [0, 4],
  [3, 8],
  [6, 1],
  [2, 7],
  [5, 9],
  [4, 10],
  [8, 2],
  [1, 6],
  [9, 0],
  [7, 3],
] as const;

const erisPairs = [
  [10, 9],
  [10, 0],
  [10, 8],
] as const;

function createRingPositions() {
  const positions = new Float32Array(NODE_COUNT * 3);

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const angle = ((index / NODE_COUNT) * Math.PI * 2) - Math.PI * 0.46;
    const radius = index === 10 ? RING_RADIUS + 0.32 : RING_RADIUS;
    const offset = index * 3;

    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = RING_Y + Math.sin(angle) * 0.16;
    positions[offset + 2] = Math.sin(angle) * radius * 0.62;
  }

  return positions;
}

function createArcPool() {
  const lines: Line[] = [];
  const positions: Float32Array[] = [];

  for (let index = 0; index < ARC_COUNT; index += 1) {
    const geometry = new BufferGeometry();
    const positionArray = new Float32Array(ARC_POINTS * 3);
    const material = new LineBasicMaterial({
      color: BONE,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    geometry.setAttribute("position", new BufferAttribute(positionArray, 3));
    lines.push(new Line(geometry, material));
    positions.push(positionArray);
  }

  return { lines, positions };
}

function createSealBeam() {
  const geometry = new BufferGeometry();
  const material = new LineBasicMaterial({
    color: SIGNAL,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
  });

  geometry.setAttribute("position", new BufferAttribute(new Float32Array([0, RING_Y, 0, 0, 0.1, 0]), 3));

  return new Line(geometry, material);
}

export function CouncilScene({ entryRef, glowTexture }: WidgetSceneProps) {
  const groupRef = useRef<Group>(null);
  const nodesRef = useRef<InstancedMesh>(null);
  const sealRef = useRef<Group>(null);
  const sealRingRef = useRef<Group>(null);
  const glowRefs = useRef<(Sprite | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const ringPositions = useMemo(() => createRingPositions(), []);
  const arcPool = useMemo(() => createArcPool(), []);
  const sealBeam = useMemo(() => createSealBeam(), []);
  const nodePosition = useMemo(() => new Vector3(), []);
  const arcStart = useMemo(() => new Vector3(), []);
  const arcEnd = useMemo(() => new Vector3(), []);
  const arcControl = useMemo(() => new Vector3(), []);
  const boneColor = useMemo(() => new Color(BONE), []);
  const dimColor = useMemo(() => new Color(DIM), []);
  const emberColor = useMemo(() => new Color(EMBER), []);
  const whiteColor = useMemo(() => new Color("#ffffff"), []);

  useEffect(() => () => {
    arcPool.lines.forEach((line) => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    });
    sealBeam.geometry.dispose();
    (sealBeam.material as LineBasicMaterial).dispose();
  }, [arcPool, sealBeam]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const nodes = nodesRef.current;
    const seal = sealRef.current;
    const sealRing = sealRingRef.current;
    const entry = entryRef.current;

    if (!group || !nodes || !seal || !sealRing || entry <= 0.001) {
      return;
    }

    const time = clock.elapsedTime;
    const local = (time % 14) / 14;
    const openings = (1 - smoothstepRange(0.18, 0.26, local)) * entry;
    const exchanges = smoothstepRange(0.18, 0.26, local) * (1 - smoothstepRange(0.52, 0.6, local)) * entry;
    const eris = smoothstepRange(0.52, 0.58, local) * (1 - smoothstepRange(0.68, 0.74, local)) * entry;
    const veto = smoothstepRange(0.68, 0.71, local) * (1 - smoothstepRange(0.82, 0.86, local)) * entry;
    const restraint = smoothstepRange(0.82, 0.96, local) * (1 - smoothstepRange(0.96, 1, local)) * entry;

    group.rotation.x = -0.16;
    group.rotation.z = Math.sin(time * 0.28) * 0.015;

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const offset = index * 3;
      const stagger = smoothstep((entry - index * 0.045) / 0.32);
      const pulse = 1 + Math.sin(time * 1.4 + index) * 0.08;
      const flare = index === 10 ? eris * 0.42 : 0;
      const vetoPulse = index === 0 ? veto * Math.sin(smoothstep((local - 0.68) / 0.15) * Math.PI) : 0;
      const scale = (0.085 + flare + vetoPulse * 0.22) * pulse * Math.max(stagger, 0.001);

      nodePosition.set(ringPositions[offset], ringPositions[offset + 1], ringPositions[offset + 2]);
      dummy.position.copy(nodePosition);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      nodes.setMatrixAt(index, dummy.matrix);

      if (index === 10) {
        nodes.setColorAt(index, emberColor);
      } else if (index === 0 && veto > 0) {
        nodes.setColorAt(index, whiteColor);
      } else {
        nodes.setColorAt(index, openings > 0.2 ? dimColor : boneColor);
      }

      const glow = glowRefs.current[index];

      if (glow) {
        glow.position.copy(nodePosition);
        glow.scale.setScalar((index === 10 ? 0.34 : 0.26) + flare + vetoPulse * 0.4);
        (glow.material as SpriteMaterial).opacity = (0.34 + flare + vetoPulse) * stagger;
      }
    }

    nodes.instanceMatrix.needsUpdate = true;

    if (nodes.instanceColor) {
      nodes.instanceColor.needsUpdate = true;
    }

    for (let arcIndex = 0; arcIndex < ARC_COUNT; arcIndex += 1) {
      const arc = arcPool.lines[arcIndex];
      const positionArray = arcPool.positions[arcIndex];
      let from = 0;
      let to = 0;
      let opacity = 0;
      let color = BONE;

      if (exchanges > 0) {
        const pair = arcPairs[(arcIndex + Math.floor(time * 1.4)) % arcPairs.length];

        from = pair[0];
        to = pair[1];
        opacity = exchanges * (0.18 + Math.sin(time * 3 + arcIndex) * 0.08);
      }

      if (eris > 0 && arcIndex < erisPairs.length) {
        const pair = erisPairs[arcIndex];

        from = pair[0];
        to = pair[1];
        opacity = eris * 0.55;
        color = EMBER;
      }

      if (veto > 0) {
        opacity = 0;
      }

      const fromIndex = from * 3;
      const toIndex = to * 3;

      arcStart.set(ringPositions[fromIndex], ringPositions[fromIndex + 1], ringPositions[fromIndex + 2]);
      arcEnd.set(ringPositions[toIndex], ringPositions[toIndex + 1], ringPositions[toIndex + 2]);
      arcControl.set((arcStart.x + arcEnd.x) * 0.5, RING_Y + 0.42 + arcIndex * 0.012, (arcStart.z + arcEnd.z) * 0.5);

      for (let pointIndex = 0; pointIndex < ARC_POINTS; pointIndex += 1) {
        const t = pointIndex / (ARC_POINTS - 1);
        const inv = 1 - t;
        const positionOffset = pointIndex * 3;

        positionArray[positionOffset] = inv * inv * arcStart.x + 2 * inv * t * arcControl.x + t * t * arcEnd.x;
        positionArray[positionOffset + 1] = inv * inv * arcStart.y + 2 * inv * t * arcControl.y + t * t * arcEnd.y;
        positionArray[positionOffset + 2] = inv * inv * arcStart.z + 2 * inv * t * arcControl.z + t * t * arcEnd.z;
      }

      (arc.geometry.getAttribute("position") as BufferAttribute).needsUpdate = true;
      (arc.material as LineBasicMaterial).opacity = Math.max(opacity, 0);
      (arc.material as LineBasicMaterial).color.set(color);
    }

    seal.visible = restraint > 0;
    (sealBeam.material as LineBasicMaterial).opacity = restraint * 0.62;
    sealBeam.scale.y = Math.max(restraint, 0.001);
    sealRing.scale.setScalar(0.25 + restraint * 0.28);
    sealRing.rotation.z = time * 0.25;
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial transparent opacity={0.9} vertexColors blending={AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      {Array.from({ length: NODE_COUNT }, (_, index) => (
        <sprite key={index} ref={(node) => { glowRefs.current[index] = node; }} scale={[0.3, 0.3, 1]}>
          <spriteMaterial map={glowTexture} color={index === 10 ? EMBER : BONE} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}
      {arcPool.lines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
      <group ref={sealRef} visible={false}>
        <primitive object={sealBeam} />
        <group ref={sealRingRef} position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.28, 0.01, 8, 48]} />
            <meshBasicMaterial color={SIGNAL} transparent opacity={0.72} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
