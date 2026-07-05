"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Group,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import type { FilmProgress } from "@/lib/film/progress";
import { smoothstepRange } from "./staging";

const FIELD_COUNT = 700;
const TAKE_COUNT = 22;
const STAR_COUNT = FIELD_COUNT + TAKE_COUNT;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const INK = [0.91, 0.89, 0.87] as const;
const BONE = [0.77, 0.71, 0.63] as const;
const SIGNAL = [0.89, 0.7, 0.25] as const;

type AmbientFieldProps = {
  progressRef: MutableRefObject<FilmProgress>;
  glowTexture: CanvasTexture;
};

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

function createAmbientGeometry() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(STAR_COUNT * 3);
  const targets = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const seeds = new Float32Array(STAR_COUNT * 4);
  const named = new Float32Array(STAR_COUNT);
  const clustered = new Float32Array(STAR_COUNT);
  const clusterCenters = [
    new Vector3(2.7, 3.1, -1.6),
    new Vector3(4.1, 3.75, 0.35),
    new Vector3(1.5, 4.2, 1.35),
    new Vector3(3.4, 2.55, 1.8),
    new Vector3(2.2, 3.55, -0.2),
  ];

  for (let index = 0; index < FIELD_COUNT; index += 1) {
    const offset = index * 3;
    const seedOffset = index * 4;
    const t = (index + 0.5) / FIELD_COUNT;
    const angle = index * GOLDEN_ANGLE;
    const depth = -5.5 + ((index * 41) % 100) / 100 * 10.5;
    const radius = 1.6 + ((index * 23) % 100) / 100 * 4.8;
    const x = Math.cos(angle) * radius + 1.2;
    const y = -0.8 + Math.pow(t, 0.72) * 5.1;
    const z = depth + Math.sin(angle) * 1.6;
    const cluster = clusterCenters[index % clusterCenters.length];
    const clusterAngle = index * GOLDEN_ANGLE * 1.7;
    const clusterRadius = 0.18 + ((index * 17) % 100) / 100 * 1.15;

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
    targets[offset] = cluster.x + Math.cos(clusterAngle) * clusterRadius;
    targets[offset + 1] = cluster.y + (((index * 13) % 100) / 100) * 0.75;
    targets[offset + 2] = cluster.z + Math.sin(clusterAngle) * clusterRadius * 0.85;
    sizes[index] = 0.02 + (((index * 53) % 100) / 100) * 0.03;
    seeds[seedOffset] = ((index * 29) % 100) / 100;
    seeds[seedOffset + 1] = ((index * 31) % 100) / 100;
    seeds[seedOffset + 2] = ((index * 37) % 100) / 100;
    seeds[seedOffset + 3] = ((index * 43) % 100) / 100;
    named[index] = 0;
    clustered[index] = index % 3 === 0 ? 0 : 1;
    mixColor(colors, index, INK, BONE, index % 8 === 0 ? 0.28 : 0);
  }

  for (let take = 0; take < TAKE_COUNT; take += 1) {
    const index = FIELD_COUNT + take;
    const offset = index * 3;
    const seedOffset = index * 4;
    const center = clusterCenters[take % clusterCenters.length];
    const angle = take * GOLDEN_ANGLE;
    const radius = 0.2 + ((take * 11) % 7) * 0.08;

    positions[offset] = -0.8 + Math.cos(angle) * 3.1;
    positions[offset + 1] = 0.2 + ((take * 7) % 100) / 100 * 3.2;
    positions[offset + 2] = -3.8 + Math.sin(angle) * 3.2;
    targets[offset] = center.x + Math.cos(angle) * radius;
    targets[offset + 1] = center.y + ((take * 5) % 6) * 0.08;
    targets[offset + 2] = center.z + Math.sin(angle) * radius * 0.85;
    sizes[index] = 0.06 + ((take * 17) % 100) / 100 * 0.06;
    seeds[seedOffset] = ((take * 43) % 100) / 100;
    seeds[seedOffset + 1] = ((take * 47) % 100) / 100;
    seeds[seedOffset + 2] = ((take * 53) % 100) / 100;
    seeds[seedOffset + 3] = ((take * 59) % 100) / 100;
    named[index] = 1;
    clustered[index] = 1;
    mixColor(colors, index, INK, SIGNAL, 0.34);
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aTarget", new BufferAttribute(targets, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));
  geometry.setAttribute("aNamed", new BufferAttribute(named, 1));
  geometry.setAttribute("aClustered", new BufferAttribute(clustered, 1));

  return geometry;
}

function createAmbientMaterial(glowTexture: CanvasTexture) {
  return new ShaderMaterial({
    uniforms: {
      uTexture: { value: glowTexture },
      uCosmos: { value: 0 },
      uSettle: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute vec3 aTarget;
      attribute vec3 aColor;
      attribute float aSize;
      attribute vec4 aSeed;
      attribute float aNamed;
      attribute float aClustered;
      uniform float uCosmos;
      uniform float uSettle;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float driftPhase = uTime * 0.035 + aSeed.x * 6.2831853;
        vec3 drift = vec3(
          sin(driftPhase) * 0.08,
          cos(uTime * 0.028 + aSeed.y * 6.2831853) * 0.06,
          sin(uTime * 0.022 + aSeed.z * 6.2831853) * 0.1
        );
        float cluster = uCosmos * aClustered * (1.0 - uSettle);
        vec3 base = position + drift;
        vec3 clustered = mix(base, aTarget, cluster);
        vec4 mvPosition = modelViewMatrix * vec4(clustered, 1.0);
        float twinkle = 0.74 + 0.26 * sin(uTime * (0.9 + aSeed.w) + aSeed.x * 6.2831853);
        float cosmosLift = mix(1.0, 1.45, uCosmos);

        vColor = mix(aColor, vec3(0.89, 0.70, 0.25), aNamed * uCosmos * 0.38);
        vAlpha = mix(0.06, 0.5, uCosmos) * twinkle * mix(1.0, 1.55, aNamed);
        gl_PointSize = aSize * cosmosLift * (320.0 / max(1.0, -mvPosition.z)) * mix(1.0, 1.8, aNamed);
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

export function AmbientField({ progressRef, glowTexture }: AmbientFieldProps) {
  const groupRef = useRef<Group>(null);
  const geometry = useMemo(() => createAmbientGeometry(), []);
  const material = useMemo(() => createAmbientMaterial(glowTexture), [glowTexture]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const { chapter, chapterLocal } = progressRef.current;
    const cosmos = chapter === 6
      ? smoothstepRange(0.08, 0.62, chapterLocal)
      : chapter === 7
        ? 1 - smoothstepRange(0, 0.45, chapterLocal)
        : 0;
    const settle = chapter === 7 ? smoothstepRange(0, 0.45, chapterLocal) : 0;

    if (!group) {
      return;
    }

    group.visible = true;
    material.uniforms.uCosmos.value = cosmos;
    material.uniforms.uSettle.value = settle;
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <primitive object={material} attach="material" />
      </points>
    </group>
  );
}
