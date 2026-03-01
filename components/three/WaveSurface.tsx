"use client";

import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface WaveSurfaceProps {
  segments: number;
  visible: boolean;
}

export function WaveSurface({ segments, visible }: WaveSurfaceProps) {
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms | null>(null);

  const handleBeforeCompile = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader =
      `
      uniform float uTime;
      ` +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        vec3 transformed = vec3(position);
        transformed.z += sin(transformed.x * 0.5 + uTime * 0.5) * 0.15;
        transformed.z += sin(transformed.x * 1.2 + transformed.y * 0.8 + uTime * 0.7) * 0.05;
        transformed.z += cos(transformed.y * 0.3 + uTime * 0.3) * 0.1;
        `
      );

    shaderRef.current = shader;
  }, []);

  useFrame(({ clock }) => {
    if (!visible || shaderRef.current === null) {
      return;
    }

    const timeUniform = shaderRef.current.uniforms.uTime as THREE.IUniform<number>;
    timeUniform.value = clock.getElapsedTime();
  });

  if (!visible) {
    return null;
  }

  return (
    <mesh
      position={[0, -2.0, -3.6]}
      rotation={[-Math.PI / 2.7, 0, 0]}
      frustumCulled={false}
    >
      <planeGeometry args={[18, 12, segments, segments]} />
      <meshBasicMaterial
        wireframe
        color="#E8E4DE"
        transparent
        opacity={0.12}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

export default WaveSurface;
