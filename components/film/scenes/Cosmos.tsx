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

const FIELD_COUNT = 900;
const TAKE_COUNT = 22;
const STAR_COUNT = FIELD_COUNT + TAKE_COUNT;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const INK = [0.91, 0.89, 0.87] as const;
const BONE = [0.77, 0.71, 0.63] as const;
const EMBER = [0.82, 0.55, 0.35] as const;
const SIGNAL = [0.89, 0.7, 0.25] as const;

type CosmosField = {
  geometry: BufferGeometry;
  positions: Float32Array;
  starts: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  named: Float32Array;
};

type CosmosProps = {
  progressRef: MutableRefObject<FilmProgress>;
  glowTexture: CanvasTexture;
};

function writeColor(colors: Float32Array, index: number, color: readonly [number, number, number]) {
  const offset = index * 3;

  colors[offset] = color[0];
  colors[offset + 1] = color[1];
  colors[offset + 2] = color[2];
}

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

function createCosmosField() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(STAR_COUNT * 3);
  const starts = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const seeds = new Float32Array(STAR_COUNT);
  const named = new Float32Array(STAR_COUNT);
  const clusterCenters = [
    new Vector3(3.45, 3.05, -1.05),
    new Vector3(2.2, 3.85, 0.9),
    new Vector3(4.25, 2.45, 1.05),
    new Vector3(1.2, 2.75, -1.45),
    new Vector3(3.05, 4.25, -0.12),
  ];

  for (let index = 0; index < FIELD_COUNT; index += 1) {
    const offset = index * 3;
    const t = (index + 0.5) / FIELD_COUNT;
    const angle = index * GOLDEN_ANGLE;
    const band = Math.pow(t, 0.62);
    const ring = Math.sqrt(Math.max(0, 1 - band * band));
    const radiusJitter = 0.72 + (((index * 37) % 100) / 100) * 0.28;
    const x = 2.35 + Math.cos(angle) * ring * 3.55 * radiusJitter;
    const y = 0.72 + band * 3.35;
    const z = -0.15 + Math.sin(angle) * ring * 2.85 * radiusJitter;

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
    starts[offset] = x * 0.16;
    starts[offset + 1] = 0.12 + (((index * 19) % 100) / 100) * 0.18;
    starts[offset + 2] = z * 0.12;
    sizes[index] = 0.06 + (((index * 53) % 100) / 100) * 0.14;
    seeds[index] = ((index * 29) % 100) / 100;
    named[index] = 0;

    if (index % 37 === 0) {
      writeColor(colors, index, EMBER);
    } else if (index % 7 === 0) {
      writeColor(colors, index, BONE);
    } else {
      writeColor(colors, index, INK);
    }
  }

  for (let take = 0; take < TAKE_COUNT; take += 1) {
    const index = FIELD_COUNT + take;
    const offset = index * 3;
    const center = clusterCenters[take % clusterCenters.length];
    const angle = take * GOLDEN_ANGLE;
    const radius = 0.18 + ((take * 11) % 7) * 0.055;
    const lift = ((take * 5) % 6) * 0.055;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + lift;
    const z = center.z + Math.sin(angle) * radius * 0.82;

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
    starts[offset] = x * 0.12;
    starts[offset + 1] = 0.16 + (take % 4) * 0.035;
    starts[offset + 2] = z * 0.1;
    sizes[index] = 0.22 + ((take * 17) % 100) / 100 * 0.14;
    seeds[index] = ((take * 43) % 100) / 100;
    named[index] = 1;
    mixColor(colors, index, INK, SIGNAL, 0.3);
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aStart", new BufferAttribute(starts, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  geometry.setAttribute("aNamed", new BufferAttribute(named, 1));

  return { geometry, positions, starts, colors, sizes, seeds, named };
}

function createStarMaterial(glowTexture: CanvasTexture) {
  return new ShaderMaterial({
    uniforms: {
      uTexture: { value: glowTexture },
      uField: { value: 0 },
      uNamed: { value: 0 },
      uExit: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute vec3 aStart;
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aSeed;
      attribute float aNamed;
      uniform float uField;
      uniform float uNamed;
      uniform float uExit;
      uniform float uTime;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float presence = mix(uField, uNamed, aNamed);
        float twinkle = 0.72 + 0.28 * sin(uTime * (1.4 + aSeed * 1.7) + aSeed * 6.2831853);
        vec3 bloom = mix(aStart, position, presence);
        vec3 settled = mix(bloom, aStart, uExit);
        vec4 mvPosition = modelViewMatrix * vec4(settled, 1.0);

        vColor = aColor;
        vAlpha = presence * (1.0 - uExit) * twinkle * mix(0.85, 1.35, aNamed);
        gl_PointSize = aSize * (300.0 / max(1.0, -mvPosition.z)) * twinkle * mix(1.0, 1.75, aNamed);
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

export function Cosmos({ progressRef, glowTexture }: CosmosProps) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const field = useMemo(() => createCosmosField(), []);
  const material = useMemo(() => createStarMaterial(glowTexture), [glowTexture]);

  useEffect(() => () => {
    field.geometry.dispose();
    material.dispose();
  }, [field, material]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const { chapter, chapterLocal } = progressRef.current;
    const inChapter = chapter === 6;
    const exiting = chapter === 7;
    const fieldPresence = chapter > 6 ? 1 : inChapter ? smoothstepRange(0, 0.5, chapterLocal) : 0;
    const namedPresence = chapter > 6 ? 1 : inChapter ? smoothstepRange(0.4, 0.8, chapterLocal) : 0;
    const exit = chapter > 7 ? 1 : exiting ? smoothstepRange(0, 0.42, chapterLocal) : 0;
    const visible = (fieldPresence > 0.001 || namedPresence > 0.001) && exit < 0.999;

    if (!group) {
      return;
    }

    group.visible = visible;

    if (!visible) {
      return;
    }

    group.rotation.y = Math.sin(clock.elapsedTime * 0.045) * 0.035;
    material.uniforms.uField.value = fieldPresence;
    material.uniforms.uNamed.value = namedPresence;
    material.uniforms.uExit.value = exit;
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group ref={groupRef} visible={false}>
      <points ref={pointsRef} geometry={field.geometry}>
        <primitive object={material} attach="material" />
      </points>
    </group>
  );
}
