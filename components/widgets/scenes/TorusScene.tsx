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
  MeshBasicMaterial,
  Object3D,
  Points,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import type { WidgetSceneProps } from "../SceneCanvas";
import { BONE, DIM, EMBER, SIGNAL, smoothstep } from "./shared";

const NODE_COUNT = 128;
const TERNARY_COUNT = 240;
const TORUS_MAJOR = 1.15;
const TORUS_Y = 1.12;
const TORUS_SHELLS = [0.22, 0.28, 0.34, 0.4] as const;

const routePath = [
  0, 17, 34, 51, 68, 85, 102, 119, 8, 25, 42, 59, 76, 93, 110, 127, 14, 31, 48, 65, 82, 99, 116, 5,
] as const;

function writeTorusPoint(index: number, target: Float32Array, offset: number) {
  const major = index % 8;
  const tube = Math.floor(index / 8) % 4;
  const shell = Math.floor(index / 32) % 4;
  const u = (major / 8) * Math.PI * 2;
  const v = (tube / 4) * Math.PI * 2;
  const radius = TORUS_SHELLS[shell];
  const outer = TORUS_MAJOR + radius * Math.cos(v);

  target[offset] = outer * Math.cos(u);
  target[offset + 1] = TORUS_Y + radius * Math.sin(v);
  target[offset + 2] = outer * Math.sin(u);
}

function createTorusNodes() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const neighbors = new Int16Array(NODE_COUNT * 6);

  for (let index = 0; index < NODE_COUNT; index += 1) {
    writeTorusPoint(index, positions, index * 3);

    const major = index % 8;
    const tube = Math.floor(index / 8) % 4;
    const shell = Math.floor(index / 32) % 4;
    const neighborOffset = index * 6;
    const majorMinus = (major + 7) % 8;
    const majorPlus = (major + 1) % 8;
    const tubeMinus = (tube + 3) % 4;
    const tubePlus = (tube + 1) % 4;
    const shellMinus = (shell + 3) % 4;
    const shellPlus = (shell + 1) % 4;

    neighbors[neighborOffset] = shell * 32 + tube * 8 + majorMinus;
    neighbors[neighborOffset + 1] = shell * 32 + tube * 8 + majorPlus;
    neighbors[neighborOffset + 2] = shell * 32 + tubeMinus * 8 + major;
    neighbors[neighborOffset + 3] = shell * 32 + tubePlus * 8 + major;
    neighbors[neighborOffset + 4] = shellMinus * 32 + tube * 8 + major;
    neighbors[neighborOffset + 5] = shellPlus * 32 + tube * 8 + major;
  }

  return { positions, neighbors };
}

function createTernaryMotes() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(TERNARY_COUNT * 3);
  const colors = new Float32Array(TERNARY_COUNT * 3);
  const seeds = new Float32Array(TERNARY_COUNT * 4);

  for (let index = 0; index < TERNARY_COUNT; index += 1) {
    const seedOffset = index * 4;
    const angle = ((index * 97.31) % 360) * (Math.PI / 180);
    const tube = ((index * 41) % 100) / 100 * Math.PI * 2;
    const radius = 0.28 + ((index * 19) % 100) / 100 * 0.88;

    seeds[seedOffset] = angle;
    seeds[seedOffset + 1] = tube;
    seeds[seedOffset + 2] = radius;
    seeds[seedOffset + 3] = index % 3;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  return { geometry, positions, colors, seeds };
}

function setColorArray(colors: Float32Array, index: number, state: number) {
  const offset = index * 3;

  if (state === 0) {
    colors[offset] = 0.816;
    colors[offset + 1] = 0.549;
    colors[offset + 2] = 0.353;
  } else if (state === 1) {
    colors[offset] = 0.09;
    colors[offset + 1] = 0.085;
    colors[offset + 2] = 0.075;
  } else {
    colors[offset] = 0.769;
    colors[offset + 1] = 0.71;
    colors[offset + 2] = 0.627;
  }
}

export function TorusScene({ entryRef, glowTexture }: WidgetSceneProps) {
  const groupRef = useRef<Group>(null);
  const wireMaterialRef = useRef<MeshBasicMaterial>(null);
  const nodesRef = useRef<InstancedMesh>(null);
  const routeRef = useRef<Sprite>(null);
  const motesRef = useRef<Points>(null);
  const motesMaterialRef = useRef<PointsMaterial>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const nodePosition = useMemo(() => new Vector3(), []);
  const nextPosition = useMemo(() => new Vector3(), []);
  const dimColor = useMemo(() => new Color(DIM), []);
  const boneColor = useMemo(() => new Color(BONE), []);
  const signalColor = useMemo(() => new Color(SIGNAL), []);
  const torusNodes = useMemo(() => createTorusNodes(), []);
  const ternaryMotes = useMemo(() => createTernaryMotes(), []);

  useEffect(() => () => {
    ternaryMotes.geometry.dispose();
  }, [ternaryMotes]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const wireMaterial = wireMaterialRef.current;
    const nodes = nodesRef.current;
    const route = routeRef.current;
    const motes = motesRef.current;
    const motesMaterial = motesMaterialRef.current;
    const entry = entryRef.current;

    if (!group || !wireMaterial || !nodes || !route || !motes || !motesMaterial || entry <= 0.001) {
      return;
    }

    const time = clock.elapsedTime;
    const routeStep = Math.floor(time / 1.1) % routePath.length;
    const nextStep = (routeStep + 1) % routePath.length;
    const routeT = (time % 1.1) / 1.1;
    const activeNode = routePath[routeStep];
    const nextNode = routePath[nextStep];

    group.rotation.y = time * 0.08;
    wireMaterial.opacity = 0.2 * entry;
    (nodes.material as MeshBasicMaterial).opacity = 0.9 * entry;
    motesMaterial.opacity = 0.32 * entry;

    const activeOffset = activeNode * 3;
    const nextOffset = nextNode * 3;

    nodePosition.set(
      torusNodes.positions[activeOffset],
      torusNodes.positions[activeOffset + 1],
      torusNodes.positions[activeOffset + 2],
    );
    nextPosition.set(
      torusNodes.positions[nextOffset],
      torusNodes.positions[nextOffset + 1],
      torusNodes.positions[nextOffset + 2],
    );
    route.position.set(
      nodePosition.x + (nextPosition.x - nodePosition.x) * routeT,
      nodePosition.y + (nextPosition.y - nodePosition.y) * routeT,
      nodePosition.z + (nextPosition.z - nodePosition.z) * routeT,
    );
    route.scale.setScalar(0.38 + Math.sin(routeT * Math.PI) * 0.16);
    (route.material as SpriteMaterial).opacity = 0.82 * entry;

    for (let index = 0; index < NODE_COUNT; index += 1) {
      const offset = index * 3;
      const lateFade = smoothstep((entry - (index % 16) * 0.012) / 0.74);

      dummy.position.set(torusNodes.positions[offset], torusNodes.positions[offset + 1], torusNodes.positions[offset + 2]);
      dummy.scale.setScalar((0.043 + (index === activeNode ? 0.055 : 0)) * Math.max(lateFade, 0.001));
      dummy.updateMatrix();
      nodes.setMatrixAt(index, dummy.matrix);
      nodes.setColorAt(index, dimColor);
    }

    for (let neighborIndex = 0; neighborIndex < 6; neighborIndex += 1) {
      nodes.setColorAt(torusNodes.neighbors[activeNode * 6 + neighborIndex], boneColor);
    }

    nodes.setColorAt(activeNode, signalColor);
    nodes.instanceMatrix.needsUpdate = true;

    if (nodes.instanceColor) {
      nodes.instanceColor.needsUpdate = true;
    }

    const positions = ternaryMotes.positions;
    const colors = ternaryMotes.colors;
    const seeds = ternaryMotes.seeds;
    const colorCycle = Math.floor(time * 0.35) % 3;

    for (let index = 0; index < TERNARY_COUNT; index += 1) {
      const positionOffset = index * 3;
      const seedOffset = index * 4;
      const angle = seeds[seedOffset] + time * 0.05;
      const tube = seeds[seedOffset + 1] + Math.sin(time * 0.18 + index) * 0.24;
      const radius = seeds[seedOffset + 2];

      positions[positionOffset] = Math.cos(angle) * radius;
      positions[positionOffset + 1] = TORUS_Y + Math.sin(tube) * 0.7;
      positions[positionOffset + 2] = Math.sin(angle) * radius;
      setColorArray(colors, index, (seeds[seedOffset + 3] + colorCycle) % 3);
    }

    (ternaryMotes.geometry.getAttribute("position") as BufferAttribute).needsUpdate = true;
    (ternaryMotes.geometry.getAttribute("color") as BufferAttribute).needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0.05, 0.02, 0]} scale={1.2}>
      <mesh>
        <torusGeometry args={[TORUS_MAJOR, 0.4, 12, 64]} />
        <meshBasicMaterial ref={wireMaterialRef} color={BONE} wireframe transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} vertexColors blending={AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      <sprite ref={routeRef} scale={[0.44, 0.44, 1]}>
        <spriteMaterial map={glowTexture} color={SIGNAL} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      <points ref={motesRef} geometry={ternaryMotes.geometry}>
        <pointsMaterial ref={motesMaterialRef} vertexColors size={0.043} sizeAttenuation transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
      </points>
      <pointLight position={[0.8, 2.8, 2.4]} intensity={0.45} color={EMBER} />
    </group>
  );
}
