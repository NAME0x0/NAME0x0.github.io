"use client";

import { useCallback, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WAVE_OPACITY_DAMP } from "@/lib/scene/sceneConfig";

export interface WaveSurfaceProps {
  segments: number;
  globalOpacityRef: RefObject<number>;
  amplitudeRef: RefObject<number>;
}

export function WaveSurface({ segments, globalOpacityRef, amplitudeRef }: WaveSurfaceProps) {
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const dampedOpacity = useRef(0);

  const handleBeforeCompile = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uAmplitude = { value: 0 };
    shader.vertexShader =
      `
      uniform float uTime;
      uniform float uAmplitude;
      ` +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        vec3 transformed = vec3(position);
        transformed.z += sin(transformed.x * 0.5 + uTime * 0.5) * 0.15 * uAmplitude;
        transformed.z += sin(transformed.x * 1.2 + transformed.y * 0.8 + uTime * 0.7) * 0.05 * uAmplitude;
        transformed.z += cos(transformed.y * 0.3 + uTime * 0.3) * 0.1 * uAmplitude;
        `
      );

    shaderRef.current = shader;
  }, []);

  useFrame(({ clock }, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const targetOpacity = globalOpacityRef.current ?? 0;
    dampedOpacity.current = THREE.MathUtils.damp(
      dampedOpacity.current,
      targetOpacity,
      WAVE_OPACITY_DAMP,
      delta
    );

    mat.opacity = dampedOpacity.current * 0.12;

    // Skip shader uniform updates when effectively invisible
    if (dampedOpacity.current < 0.005) return;

    const shader = shaderRef.current;
    if (!shader) return;

    shader.uniforms.uTime.value = clock.getElapsedTime();
    shader.uniforms.uAmplitude.value = amplitudeRef.current ?? 0;
  });

  return (
    <mesh
      position={[0, -2.0, -3.6]}
      rotation={[-Math.PI / 2.7, 0, 0]}
      frustumCulled={false}
    >
      <planeGeometry args={[18, 12, segments, segments]} />
      <meshBasicMaterial
        ref={materialRef}
        wireframe
        color="#E8E4DE"
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.FrontSide}
        toneMapped={false}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

export default WaveSurface;
