"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_OPACITY_DAMP } from "@/lib/scene/sceneConfig";

export interface VoidParticlesProps {
  count: number;
  globalOpacityRef: RefObject<number>;
  speedScaleRef: RefObject<number>;
  scrollYRef: RefObject<number>;
}

type VoidUniforms = {
  uTime: { value: number };
  uScrollY: { value: number };
  uResolution: { value: THREE.Vector2 };
  uGlobalOpacity: { value: number };
  uSpeedScale: { value: number };
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollY;
  uniform vec2 uResolution;
  uniform float uSpeedScale;
  attribute float aRandomOffset;
  varying float vDepthFactor;

  void main() {
    float time = uTime * uSpeedScale;
    float randomOffset = aRandomOffset;
    vec3 pos = position;

    pos.x += sin(time * 0.15 + pos.y * 2.0 + randomOffset) * 0.08;
    pos.y += cos(time * 0.12 + pos.x * 1.5 + randomOffset * 2.0) * 0.06;
    pos.z += sin(time * 0.1 + randomOffset * 3.0) * 0.03;

    float depthFactor = (pos.z + 5.0) / 10.0;
    pos.y += uScrollY * mix(0.5, 2.0, depthFactor);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(2.0, 4.0, depthFactor) * (uResolution.y / 800.0) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vDepthFactor = depthFactor;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uGlobalOpacity;
  varying float vDepthFactor;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);

    if (dist > 0.5) {
      discard;
    }

    float edge = smoothstep(0.5, 0.4, dist);
    float opacity = mix(0.03, 0.15, vDepthFactor) * edge * uGlobalOpacity;

    if (opacity < 0.001) {
      discard;
    }

    gl_FragColor = vec4(vec3(0.91, 0.89, 0.87), opacity);
  }
`;

export function VoidParticles({
  count,
  globalOpacityRef,
  speedScaleRef,
  scrollYRef,
}: VoidParticlesProps) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dampedOpacity = useRef(1);
  const { size } = useThree();

  const uniforms = useMemo<VoidUniforms>(
    () => ({
      uTime: { value: 0 },
      uScrollY: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uGlobalOpacity: { value: 1 },
      uSpeedScale: { value: 1 },
    }),
    []
  );

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomOffsets = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = Math.random() * 10 - 5;
      randomOffsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, randomOffsets };
  }, [count]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.height, size.width, uniforms]);

  useEffect(() => {
    const geometry = geometryRef.current;
    if (!geometry) {
      return;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(particleData.positions, 3));
    geometry.setAttribute("aRandomOffset", new THREE.BufferAttribute(particleData.randomOffsets, 1));
    geometry.computeBoundingSphere();
  }, [particleData]);

  useEffect(() => {
    const geometry = geometryRef.current;
    const material = materialRef.current;

    return () => {
      geometry?.dispose();
      material?.dispose();
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const targetOpacity = globalOpacityRef.current ?? 0;
    dampedOpacity.current = THREE.MathUtils.damp(
      dampedOpacity.current,
      targetOpacity,
      PARTICLE_OPACITY_DAMP,
      delta
    );

    // Skip uniform updates when effectively invisible
    if (dampedOpacity.current < 0.005) {
      mat.uniforms.uGlobalOpacity.value = 0;
      return;
    }

    mat.uniforms.uGlobalOpacity.value = dampedOpacity.current;
    mat.uniforms.uSpeedScale.value = speedScaleRef.current ?? 1;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uScrollY.value = scrollYRef.current ?? 0;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default VoidParticles;
