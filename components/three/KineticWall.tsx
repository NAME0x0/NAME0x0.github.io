"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Types ────────────────────────────────────────────── */

export interface KineticWallProps {
  /** 0→1 scroll-based reveal */
  progress: number;
  /** Normalized mouse [-1,1] */
  mousePosition: [number, number];
  /** Toggle rendering */
  visible: boolean;
}

/* ─── Config ───────────────────────────────────────────── */

const COLS = 48;
const ROWS = 32;
const TILE_SIZE = 0.065; // world-space size of each tile
const GAP = 0.008; // gap between tiles
const CELL = TILE_SIZE + GAP;
const TOTAL = COLS * ROWS; // 1536 instances

// Off-white matching #E8E4DE
const INK_COLOR = new THREE.Color(0.91, 0.89, 0.87);

/* ─── Shaders ──────────────────────────────────────────── */

/**
 * Custom instanced shader:
 * - Each tile gets its own rotation around Y and X axes
 * - Rotation is driven by time + spatial noise (sin/cos, no simplex)
 * - Mouse proximity causes tiles to "lean" toward cursor
 * - Brightness varies with face normal dot light direction → shimmer
 * - Reveal sweeps from center outward
 */
const vertexShader = /* glsl */ `
  attribute float aIndex;
  attribute vec2 aGridPos;      // column, row in grid
  attribute float aPhaseOffset; // per-tile random phase

  uniform float uTime;
  uniform vec2 uMouse;          // normalized [-1,1]
  uniform float uProgress;      // 0→1 reveal
  uniform vec2 uGridDims;       // cols, rows
  uniform float uTileSize;
  uniform float uCellSize;

  varying float vBrightness;
  varying float vAlpha;

  // Rotation matrix around Y axis
  mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
  }

  // Rotation matrix around X axis
  mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
  }

  void main() {
    // Grid position in world space (centered)
    float gridX = (aGridPos.x - uGridDims.x * 0.5 + 0.5) * uCellSize;
    float gridY = (aGridPos.y - uGridDims.y * 0.5 + 0.5) * uCellSize;

    // ── Wind / noise rotation ──
    // Multiple sin/cos waves at different frequencies create organic motion
    float windY = sin(uTime * 0.4 + aGridPos.x * 0.15 + aGridPos.y * 0.08 + aPhaseOffset)
                * cos(uTime * 0.25 + aGridPos.y * 0.12 + aPhaseOffset * 1.7) * 0.35;
    float windX = cos(uTime * 0.3 + aGridPos.x * 0.1 + aPhaseOffset * 2.3)
                * sin(uTime * 0.2 + aGridPos.y * 0.18 + aPhaseOffset * 0.8) * 0.25;

    // ── Traveling wave ──
    // A wave that sweeps across the wall for a more dramatic shimmer
    float wave = sin(uTime * 0.6 + aGridPos.x * 0.2 - aGridPos.y * 0.05) * 0.2;
    windY += wave;

    // ── Mouse influence ──
    // Convert mouse from [-1,1] to grid-relative coords
    vec2 mouseGrid = uMouse * vec2(uGridDims.x, uGridDims.y) * 0.5;
    vec2 tileDist = aGridPos - (mouseGrid + uGridDims * 0.5);
    float mouseLen = length(tileDist) / max(uGridDims.x, uGridDims.y);
    float mouseInfluence = smoothstep(0.25, 0.0, mouseLen);

    // Tiles near mouse tilt toward cursor
    vec2 mouseDir = normalize(tileDist + 0.001);
    windY += mouseDir.x * mouseInfluence * 0.6;
    windX += mouseDir.y * mouseInfluence * 0.4;

    // ── Apply rotation to vertex position ──
    vec3 pos = position * uTileSize; // scale tile geometry
    mat3 rot = rotateY(windY) * rotateX(windX);
    pos = rot * pos;

    // Offset to grid position
    pos.x += gridX;
    pos.y += gridY;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // ── Lighting / brightness ──
    // Normal after rotation (original normal is (0,0,1) for a plane)
    vec3 normal = rot * vec3(0.0, 0.0, 1.0);
    // Light from slightly above and right
    vec3 lightDir = normalize(vec3(0.3, 0.4, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    // Add some specular-like component based on normal.z (facing camera = brighter)
    float specular = pow(max(normal.z, 0.0), 3.0);

    vBrightness = mix(0.04, 0.22, diffuse) + specular * 0.1;

    // Mouse proximity adds subtle glow
    vBrightness += mouseInfluence * 0.08;

    // ── Reveal ──
    // Radial reveal from center
    vec2 normalizedPos = aGridPos / uGridDims;
    float centerDist = distance(normalizedPos, vec2(0.5));
    float revealRadius = uProgress * 0.85;
    float reveal = smoothstep(revealRadius, revealRadius - 0.12, centerDist);

    vAlpha = reveal;

    // Edge fade — tiles at the boundary of the wall are dimmer
    float edgeFade = smoothstep(0.0, 0.08, normalizedPos.x)
                   * smoothstep(1.0, 0.92, normalizedPos.x)
                   * smoothstep(0.0, 0.08, normalizedPos.y)
                   * smoothstep(1.0, 0.92, normalizedPos.y);
    vAlpha *= edgeFade;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying float vBrightness;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.01) discard;

    // Off-white base color
    vec3 color = vec3(0.91, 0.89, 0.87);
    // Modulate by brightness (simulates light catching the tilted panels)
    color *= vBrightness;

    gl_FragColor = vec4(color, vAlpha * vBrightness * 0.4);
  }
`;

/* ─── Component ────────────────────────────────────────── */

export function KineticWall({ progress, mousePosition, visible }: KineticWallProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const revealRef = useRef(0);
  const { size } = useThree();

  // Generate per-instance attributes
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
        // Deterministic pseudo-random phase per tile
        phase[i] = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453 % 6.2832;
        i++;
      }
    }

    return { indexArray: idx, gridPosArray: grid, phaseArray: phase };
  }, []);

  // Create the geometry with instanced attributes
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);

    // Set up instanced attributes
    const indexAttr = new THREE.InstancedBufferAttribute(indexArray, 1);
    const gridPosAttr = new THREE.InstancedBufferAttribute(gridPosArray, 2);
    const phaseAttr = new THREE.InstancedBufferAttribute(phaseArray, 1);

    geo.setAttribute("aIndex", indexAttr);
    geo.setAttribute("aGridPos", gridPosAttr);
    geo.setAttribute("aPhaseOffset", phaseAttr);

    return geo;
  }, [indexArray, gridPosArray, phaseArray]);

  // Shader material with uniforms
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uProgress: { value: 0 },
          uGridDims: { value: new THREE.Vector2(COLS, ROWS) },
          uTileSize: { value: TILE_SIZE },
          uCellSize: { value: CELL },
        },
      }),
    []
  );

  // Store ref
  useEffect(() => {
    materialRef.current = material;
    return () => {
      material.dispose();
    };
  }, [material]);

  // Set up dummy instance matrices (all identity — the shader handles positioning)
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TOTAL; i++) {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Adjust camera distance based on viewport
  const cameraZ = useMemo(() => {
    // Make the wall fill roughly 80% of viewport width
    const wallWidth = COLS * CELL;
    const fov = 50;
    const aspect = size.width / size.height;
    const halfFovRad = (fov / 2) * (Math.PI / 180);
    return (wallWidth / 2) / (Math.tan(halfFovRad) * aspect) * 1.1;
  }, [size.width, size.height]);

  // Animate
  useFrame(({ clock, camera }, delta) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.set(
      mousePosition[0],
      mousePosition[1]
    );

    // Smooth reveal
    const target = THREE.MathUtils.clamp(progress, 0, 1);
    revealRef.current = THREE.MathUtils.damp(revealRef.current, target, 2.5, delta);
    materialRef.current.uniforms.uProgress.value = revealRef.current;

    // Position camera to frame the wall
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraZ, 3, delta);
  });

  if (!visible) return null;

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
