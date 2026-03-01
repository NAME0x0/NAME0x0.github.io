"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface VoidParticlesProps {
  count: number;
  scrollY: number;
  visible: boolean;
}

type VoidUniforms = {
  uTime: { value: number };
  uScrollY: { value: number };
  uResolution: { value: THREE.Vector2 };
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollY;
  uniform vec2 uResolution;
  attribute float aRandomOffset;
  varying float vDepthFactor;

  void main() {
    float time = uTime;
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
  varying float vDepthFactor;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);

    if (dist > 0.5) {
      discard;
    }

    float edge = smoothstep(0.5, 0.4, dist);
    float opacity = mix(0.03, 0.15, vDepthFactor) * edge;
    gl_FragColor = vec4(vec3(0.91, 0.89, 0.87), opacity);
  }
`;

export function VoidParticles({ count, scrollY, visible }: VoidParticlesProps) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo<VoidUniforms>(
    () => ({
      uTime: { value: 0 },
      uScrollY: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
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
    return () => {
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    if (!visible || materialRef.current === null) {
      return;
    }

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uScrollY.value = scrollY;
  });

  return (
    <points visible={visible} frustumCulled={false}>
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
