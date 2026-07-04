"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import type { WidgetSceneProps } from "../SceneCanvas";

const FIELD_COUNT = 300;
const TAKE_COUNT = 22;
const STAR_COUNT = FIELD_COUNT + TAKE_COUNT;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const INK = [0.91, 0.89, 0.87] as const;
const BONE = [0.77, 0.71, 0.63] as const;
const SIGNAL = [0.89, 0.7, 0.25] as const;

function mixColor(
  colors: Float32Array,
  index: number,
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number,
) {
  const offset = index * 3;
  const inverse = 1 - amount;

  colors[offset] = from[0] * inverse + to[0] * amount;
  colors[offset + 1] = from[1] * inverse + to[1] * amount;
  colors[offset + 2] = from[2] * inverse + to[2] * amount;
}

function createStarGeometry() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const seeds = new Float32Array(STAR_COUNT * 4);
  const named = new Float32Array(STAR_COUNT);
  const clusterCenters = [
    new Vector3(-0.8, 1.8, -1.2),
    new Vector3(0.65, 2.2, -0.45),
    new Vector3(1.35, 1.5, 0.65),
    new Vector3(-0.15, 2.55, 0.95),
    new Vector3(1.05, 2.05, -1.25),
  ];

  for (let index = 0; index < FIELD_COUNT; index += 1) {
    const offset = index * 3;
    const seedOffset = index * 4;
    const t = (index + 0.5) / FIELD_COUNT;
    const angle = index * GOLDEN_ANGLE;
    const depth = -2.4 + ((index * 41) % 100) / 100 * 4.2;
    const radius = 0.8 + ((index * 23) % 100) / 100 * 2.45;

    positions[offset] = Math.cos(angle) * radius * 0.86;
    positions[offset + 1] = -0.25 + Math.pow(t, 0.72) * 3.1;
    positions[offset + 2] = depth + Math.sin(angle) * 0.9;
    sizes[index] = 0.08 + (((index * 53) % 100) / 100) * 0.12;
    seeds[seedOffset] = ((index * 29) % 100) / 100;
    seeds[seedOffset + 1] = ((index * 31) % 100) / 100;
    seeds[seedOffset + 2] = ((index * 37) % 100) / 100;
    seeds[seedOffset + 3] = ((index * 43) % 100) / 100;
    named[index] = 0;
    mixColor(colors, index, INK, BONE, index % 8 === 0 ? 0.28 : 0);
  }

  for (let take = 0; take < TAKE_COUNT; take += 1) {
    const index = FIELD_COUNT + take;
    const offset = index * 3;
    const seedOffset = index * 4;
    const center = clusterCenters[take % clusterCenters.length];
    const angle = take * GOLDEN_ANGLE;
    const radius = 0.12 + ((take * 11) % 7) * 0.07;

    positions[offset] = center.x + Math.cos(angle) * radius;
    positions[offset + 1] = center.y + ((take * 5) % 6) * 0.07;
    positions[offset + 2] = center.z + Math.sin(angle) * radius * 0.85;
    sizes[index] = 0.17 + ((take * 17) % 100) / 100 * 0.12;
    seeds[seedOffset] = ((take * 43) % 100) / 100;
    seeds[seedOffset + 1] = ((take * 47) % 100) / 100;
    seeds[seedOffset + 2] = ((take * 53) % 100) / 100;
    seeds[seedOffset + 3] = ((take * 59) % 100) / 100;
    named[index] = 1;
    mixColor(colors, index, INK, SIGNAL, 0.42);
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));
  geometry.setAttribute("aNamed", new BufferAttribute(named, 1));

  return geometry;
}

function createStarMaterial(glowTexture: WidgetSceneProps["glowTexture"]) {
  return new ShaderMaterial({
    uniforms: {
      uTexture: { value: glowTexture },
      uEntry: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aSize;
      attribute vec4 aSeed;
      attribute float aNamed;
      uniform float uEntry;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec3 bloomOrigin = vec3(0.18, 1.25, 0.0);
        float driftPhase = uTime * 0.04 + aSeed.x * 6.2831853;
        vec3 drift = vec3(
          sin(driftPhase) * 0.045,
          cos(uTime * 0.03 + aSeed.y * 6.2831853) * 0.035,
          sin(uTime * 0.025 + aSeed.z * 6.2831853) * 0.06
        );
        vec3 bloomed = mix(bloomOrigin, position + drift, uEntry);
        vec4 mvPosition = modelViewMatrix * vec4(bloomed, 1.0);
        float twinkle = 0.72 + 0.28 * sin(uTime * (0.9 + aSeed.w) + aSeed.x * 6.2831853);

        vColor = mix(aColor, vec3(0.89, 0.70, 0.25), aNamed * 0.28);
        vAlpha = mix(0.0, mix(0.38, 0.92, aNamed), uEntry) * twinkle;
        gl_PointSize = aSize * (330.0 / max(1.0, -mvPosition.z)) * mix(1.0, 1.8, aNamed);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec4 glow = texture2D(uTexture, gl_PointCoord);

        if (glow.a < 0.02) discard;

        gl_FragColor = vec4(vColor, glow.a * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

export function StarsScene({ entryRef, glowTexture }: WidgetSceneProps) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => createStarGeometry(), []);
  const material = useMemo(() => createStarMaterial(glowTexture), [glowTexture]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const points = pointsRef.current;

    if (!group || !points) {
      return;
    }

    const entry = entryRef.current;

    material.uniforms.uEntry.value = entry;
    material.uniforms.uTime.value = clock.elapsedTime;
    group.rotation.y = clock.elapsedTime * 0.025;
    group.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <group ref={groupRef} position={[-0.08, -0.35, 0]} scale={1.22}>
      <points ref={pointsRef} geometry={geometry}>
        <primitive object={material} attach="material" />
      </points>
    </group>
  );
}
