"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
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
import type { FilmProgress } from "@/lib/film/progress";
import { layerPresence, smoothstep, smoothstepRange } from "./staging";

const SIGNAL = "#E3B341";
const DIM = "#8A8578";
const EMBER = "#D08C5A";
const BONE = "#C4B5A0";
const NODE_COUNT = 11;
const ARC_COUNT = 8;
const ARC_POINTS = 18;
const RING_RADIUS = 1.28;
const RING_Y = 1.34;
const TORUS_MAJOR = 1.2;
const TORUS_Y = 1.55;
const TORUS_SHELLS = [0.24, 0.3, 0.36, 0.42] as const;

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

function torusPoint(index: number, target: Vector3) {
  const major = index % 8;
  const tube = Math.floor(index / 8) % 4;
  const shell = Math.floor(index / 32) % 4;
  const u = (major / 8) * Math.PI * 2;
  const v = (tube / 4) * Math.PI * 2;
  const radius = TORUS_SHELLS[shell];
  const outer = TORUS_MAJOR + radius * Math.cos(v);

  target.set(outer * Math.cos(u), TORUS_Y + radius * Math.sin(v), outer * Math.sin(u));
}

function createCouncilGeometry() {
  const ringPositions = new Float32Array(NODE_COUNT * 3);
  const torusTargets = new Float32Array(NODE_COUNT * 3);
  const torusTarget = new Vector3();

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const angle = ((index / NODE_COUNT) * Math.PI * 2) - Math.PI * 0.46;
    const radius = index === 10 ? RING_RADIUS + 0.32 : RING_RADIUS;
    const positionIndex = index * 3;

    ringPositions[positionIndex] = Math.cos(angle) * radius;
    ringPositions[positionIndex + 1] = RING_Y + Math.sin(angle) * 0.16;
    ringPositions[positionIndex + 2] = Math.sin(angle) * radius * 0.62;

    torusPoint(index * 9, torusTarget);
    torusTargets[positionIndex] = torusTarget.x;
    torusTargets[positionIndex + 1] = torusTarget.y;
    torusTargets[positionIndex + 2] = torusTarget.z;
  }

  return { ringPositions, torusTargets };
}

function createArcPool() {
  const geometries: BufferGeometry[] = [];
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
    geometries.push(geometry);
    lines.push(new Line(geometry, material));
    positions.push(positionArray);
  }

  return { geometries, lines, positions };
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

  geometry.setAttribute("position", new BufferAttribute(new Float32Array([0, RING_Y, 0, 0, 0.08, 0]), 3));

  return new Line(geometry, material);
}

type CouncilProps = {
  progressRef: MutableRefObject<FilmProgress>;
  glowTexture: CanvasTexture;
};

export function Council({ progressRef, glowTexture }: CouncilProps) {
  const groupRef = useRef<Group>(null);
  const nodesRef = useRef<InstancedMesh>(null);
  const sealRef = useRef<Group>(null);
  const sealRingRef = useRef<Group>(null);
  const glowRefs = useRef<(Sprite | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const boneColor = useMemo(() => new Color(BONE), []);
  const dimColor = useMemo(() => new Color(DIM), []);
  const emberColor = useMemo(() => new Color(EMBER), []);
  const signalColor = useMemo(() => new Color(SIGNAL), []);
  const whiteColor = useMemo(() => new Color("#ffffff"), []);
  const nodePosition = useMemo(() => new Vector3(), []);
  const arcStart = useMemo(() => new Vector3(), []);
  const arcEnd = useMemo(() => new Vector3(), []);
  const arcControl = useMemo(() => new Vector3(), []);
  const councilGeometry = useMemo(() => createCouncilGeometry(), []);
  const arcPool = useMemo(() => createArcPool(), []);
  const sealBeam = useMemo(() => createSealBeam(), []);

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

    if (!group || !nodes || !seal || !sealBeam || !sealRing) {
      return;
    }

    const { chapter, chapterLocal } = progressRef.current;
    const local = chapterLocal;
    const councilPresence = layerPresence(chapter, local, 4);
    const visible = councilPresence > 0.001;

    group.visible = visible;

    if (!visible) {
      return;
    }

    const time = clock.elapsedTime;
    const entry = councilPresence;
    const snapToLattice = 0;
    const openings = (1 - smoothstepRange(0.25, 0.33, local)) * councilPresence;
    const exchanges = smoothstepRange(0.25, 0.33, local) * (1 - smoothstepRange(0.55, 0.63, local)) * councilPresence;
    const eris = smoothstepRange(0.55, 0.6, local) * (1 - smoothstepRange(0.7, 0.76, local)) * councilPresence;
    const veto = smoothstepRange(0.7, 0.73, local) * (1 - smoothstepRange(0.85, 0.88, local)) * councilPresence;
    const restraint = smoothstepRange(0.85, 1, local) * councilPresence;

    group.rotation.x = -0.16;
    group.rotation.z = Math.sin(time * 0.28) * 0.015;

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const stagger = smoothstep((entry - index * 0.025) / 0.25);
      const pulse = 1 + Math.sin(time * 1.4 + index) * 0.08;
      const flare = index === 10 ? eris * 0.42 : 0;
      const vetoPulse = index === 0 ? veto * Math.sin(smoothstep((local - 0.7) / 0.15) * Math.PI) : 0;
      const scale = (0.085 + flare + vetoPulse * 0.22) * pulse * Math.max(stagger, snapToLattice);
      const ringX = councilGeometry.ringPositions[positionIndex];
      const ringY = councilGeometry.ringPositions[positionIndex + 1];
      const ringZ = councilGeometry.ringPositions[positionIndex + 2];
      const torusX = councilGeometry.torusTargets[positionIndex];
      const torusY = councilGeometry.torusTargets[positionIndex + 1];
      const torusZ = councilGeometry.torusTargets[positionIndex + 2];

      nodePosition.set(
        ringX + (torusX - ringX) * snapToLattice,
        ringY + (torusY - ringY) * snapToLattice,
        ringZ + (torusZ - ringZ) * snapToLattice,
      );
      dummy.position.copy(nodePosition);
      dummy.scale.setScalar(Math.max(scale, 0.001));
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
        (glow.material as SpriteMaterial).opacity = (0.34 + flare + vetoPulse) * Math.max(stagger, snapToLattice);
      }
    }

    nodes.instanceMatrix.needsUpdate = true;

    if (nodes.instanceColor) {
      nodes.instanceColor.needsUpdate = true;
    }

    for (let arcIndex = 0; arcIndex < ARC_COUNT; arcIndex += 1) {
      const arc = arcPool.lines[arcIndex];
      const positionArray = arcPool.positions[arcIndex];

      if (!arc) {
        continue;
      }

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

      arcStart.set(
        councilGeometry.ringPositions[fromIndex],
        councilGeometry.ringPositions[fromIndex + 1],
        councilGeometry.ringPositions[fromIndex + 2],
      );
      arcEnd.set(
        councilGeometry.ringPositions[toIndex],
        councilGeometry.ringPositions[toIndex + 1],
        councilGeometry.ringPositions[toIndex + 2],
      );
      arcControl.set((arcStart.x + arcEnd.x) * 0.5, RING_Y + 0.42 + arcIndex * 0.012, (arcStart.z + arcEnd.z) * 0.5);

      for (let pointIndex = 0; pointIndex < ARC_POINTS; pointIndex += 1) {
        const t = pointIndex / (ARC_POINTS - 1);
        const inv = 1 - t;
        const offset = pointIndex * 3;

        positionArray[offset] = inv * inv * arcStart.x + 2 * inv * t * arcControl.x + t * t * arcEnd.x;
        positionArray[offset + 1] = inv * inv * arcStart.y + 2 * inv * t * arcControl.y + t * t * arcEnd.y;
        positionArray[offset + 2] = inv * inv * arcStart.z + 2 * inv * t * arcControl.z + t * t * arcEnd.z;
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
    <group ref={groupRef} visible={false}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial transparent opacity={0.9} vertexColors blending={AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      {Array.from({ length: NODE_COUNT }, (_, index) => (
        <sprite key={index} ref={(node) => { glowRefs.current[index] = node; }} scale={[0.3, 0.3, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={index === 10 ? EMBER : BONE}
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
          />
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
