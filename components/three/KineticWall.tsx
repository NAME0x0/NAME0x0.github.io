"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  WALL_COLS,
  WALL_TILE_SIZE,
  WALL_GAP,
  WALL_REVEAL_DAMP,
  WALL_OPACITY_DAMP,
} from "@/lib/scene/sceneConfig";

/* ─── Types ────────────────────────────────────────────── */

export interface KineticWallProps {
  globalOpacityRef: RefObject<number>;
  energyRef: RefObject<number>;
  revealTargetRef: RefObject<number>;
  mousePosRef: RefObject<[number, number]>;
  wallRows: number;
}

/* ─── Config ───────────────────────────────────────────── */

const COLS = WALL_COLS;
const TILE_SIZE = WALL_TILE_SIZE;
const GAP = WALL_GAP;
const CELL = TILE_SIZE + GAP;

/* ─── Shaders ──────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  attribute float aIndex;
  attribute vec2 aGridPos;
  attribute float aPhaseOffset;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uProgress;
  uniform vec2 uGridDims;
  uniform float uTileSize;
  uniform float uCellSize;
  uniform float uEnergy;

  varying float vBrightness;
  varying float vAlpha;

  mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
  }

  mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
  }

  void main() {
    float gridX = (aGridPos.x - uGridDims.x * 0.5 + 0.5) * uCellSize;
    float gridY = (aGridPos.y - uGridDims.y * 0.5 + 0.5) * uCellSize;

    // Wind / noise rotation — scaled by energy
    float windY = sin(uTime * 0.4 + aGridPos.x * 0.15 + aGridPos.y * 0.08 + aPhaseOffset)
                * cos(uTime * 0.25 + aGridPos.y * 0.12 + aPhaseOffset * 1.7) * 0.35 * uEnergy;
    float windX = cos(uTime * 0.3 + aGridPos.x * 0.1 + aPhaseOffset * 2.3)
                * sin(uTime * 0.2 + aGridPos.y * 0.18 + aPhaseOffset * 0.8) * 0.25 * uEnergy;

    // Traveling wave — scaled by energy
    float wave = sin(uTime * 0.6 + aGridPos.x * 0.2 - aGridPos.y * 0.05) * 0.2 * uEnergy;
    windY += wave;

    // Mouse influence
    vec2 mouseGrid = uMouse * vec2(uGridDims.x, uGridDims.y) * 0.5;
    vec2 tileDist = aGridPos - (mouseGrid + uGridDims * 0.5);
    float mouseLen = length(tileDist) / max(uGridDims.x, uGridDims.y);
    float mouseInfluence = smoothstep(0.25, 0.0, mouseLen);

    vec2 mouseDir = normalize(tileDist + 0.001);
    windY += mouseDir.x * mouseInfluence * 0.6;
    windX += mouseDir.y * mouseInfluence * 0.4;

    vec3 pos = position * uTileSize;
    mat3 rot = rotateY(windY) * rotateX(windX);
    pos = rot * pos;

    pos.x += gridX;
    pos.y += gridY;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Lighting / brightness
    vec3 normal = rot * vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(0.3, 0.4, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float specular = pow(max(normal.z, 0.0), 3.0);

    vBrightness = mix(0.04, 0.22, diffuse) + specular * 0.1;
    vBrightness += mouseInfluence * 0.08;

    // Reveal
    vec2 normalizedPos = aGridPos / uGridDims;
    float centerDist = distance(normalizedPos, vec2(0.5));
    float revealRadius = uProgress * 0.85;
    float reveal = smoothstep(revealRadius, revealRadius - 0.12, centerDist);

    vAlpha = reveal;

    // Edge fade
    float edgeFade = smoothstep(0.0, 0.08, normalizedPos.x)
                   * smoothstep(1.0, 0.92, normalizedPos.x)
                   * smoothstep(0.0, 0.08, normalizedPos.y)
                   * smoothstep(1.0, 0.92, normalizedPos.y);
    vAlpha *= edgeFade;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uGlobalOpacity;
  varying float vBrightness;
  varying float vAlpha;

  void main() {
    float alpha = vAlpha * vBrightness * 0.4 * uGlobalOpacity;
    if (alpha < 0.01) discard;

    vec3 color = vec3(0.91, 0.89, 0.87) * vBrightness;
    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─── Component ────────────────────────────────────────── */

export function KineticWall({
  globalOpacityRef,
  energyRef,
  revealTargetRef,
  mousePosRef,
  wallRows,
}: KineticWallProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const revealRef = useRef(0);
  const dampedOpacity = useRef(1);
  const dampedEnergy = useRef(1);
  const { size } = useThree();

  const ROWS = wallRows;
  const TOTAL = COLS * ROWS;

  const { indexArray, gridPosArray, phaseArray } = useMemo(() => {
    const idx = new Float32Array(TOTAL);
    const grid = new Float32Array(TOTAL * 2);
    const phase = new Float32Array(TOTAL);

    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        idx[i] = i;
        grid[i * 2] = col;
        grid[i * 2 + 1] = row;
        phase[i] = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453 % 6.2832;
        i++;
      }
    }

    return { indexArray: idx, gridPosArray: grid, phaseArray: phase };
  }, [ROWS, TOTAL]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);

    const indexAttr = new THREE.InstancedBufferAttribute(indexArray, 1);
    const gridPosAttr = new THREE.InstancedBufferAttribute(gridPosArray, 2);
    const phaseAttr = new THREE.InstancedBufferAttribute(phaseArray, 1);

    geo.setAttribute("aIndex", indexAttr);
    geo.setAttribute("aGridPos", gridPosAttr);
    geo.setAttribute("aPhaseOffset", phaseAttr);

    return geo;
  }, [indexArray, gridPosArray, phaseArray]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uProgress: { value: 0 },
          uGridDims: { value: new THREE.Vector2(COLS, ROWS) },
          uTileSize: { value: TILE_SIZE },
          uCellSize: { value: CELL },
          uGlobalOpacity: { value: 1 },
          uEnergy: { value: 1 },
        },
      }),
    [ROWS]
  );

  useEffect(() => {
    materialRef.current = material;
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TOTAL; i++) {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [TOTAL]);

  const cameraZ = useMemo(() => {
    const wallWidth = COLS * CELL;
    const fov = 50;
    const aspect = size.width / size.height;
    const halfFovRad = (fov / 2) * (Math.PI / 180);
    return (wallWidth / 2) / (Math.tan(halfFovRad) * aspect) * 1.1;
  }, [size.width, size.height]);

  useFrame(({ clock, camera }, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const targetOpacity = globalOpacityRef.current ?? 0;
    const targetEnergy = energyRef.current ?? 0;
    const targetReveal = revealTargetRef.current ?? 0;

    dampedOpacity.current = THREE.MathUtils.damp(
      dampedOpacity.current,
      targetOpacity,
      WALL_OPACITY_DAMP,
      delta
    );

    dampedEnergy.current = THREE.MathUtils.damp(
      dampedEnergy.current,
      targetEnergy,
      WALL_OPACITY_DAMP,
      delta
    );

    // Skip uniform updates when effectively invisible
    if (dampedOpacity.current < 0.005) {
      mat.uniforms.uGlobalOpacity.value = 0;
      return;
    }

    mat.uniforms.uGlobalOpacity.value = dampedOpacity.current;
    mat.uniforms.uEnergy.value = dampedEnergy.current;
    mat.uniforms.uTime.value = clock.getElapsedTime();

    const mousePos = mousePosRef.current ?? [0, 0];
    mat.uniforms.uMouse.value.set(mousePos[0], mousePos[1]);

    const clampedReveal = THREE.MathUtils.clamp(targetReveal, 0, 1);
    revealRef.current = THREE.MathUtils.damp(revealRef.current, clampedReveal, WALL_REVEAL_DAMP, delta);
    mat.uniforms.uProgress.value = revealRef.current;

    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraZ, 3, delta);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, TOTAL]}
      frustumCulled={false}
      renderOrder={1}
    />
  );
}

export default KineticWall;
