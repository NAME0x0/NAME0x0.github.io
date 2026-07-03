"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  Group,
  LinearFilter,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { filmProgressStore, useFilmProgress } from "@/lib/film/progress";

function createCircuitTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.fillStyle = "#08090a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(196, 181, 160, 0.58)";
  ctx.lineWidth = 2;

  for (let row = 0; row < 18; row += 1) {
    const y = 72 + row * 52;

    ctx.beginPath();
    ctx.moveTo(72, y);

    for (let col = 0; col < 14; col += 1) {
      const x = 112 + col * 62;
      const offset = ((row * 7 + col * 11) % 5) * 5;

      ctx.lineTo(x, y + offset);
      ctx.lineTo(x + 24, y + offset);
      ctx.lineTo(x + 24, y + 28 - offset);
    }

    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(91, 185, 210, 0.34)";
  ctx.lineWidth = 1;

  for (let col = 0; col < 20; col += 1) {
    const x = 48 + col * 48;

    ctx.beginPath();
    ctx.moveTo(x, 86);
    ctx.lineTo(x + ((col % 3) - 1) * 24, 932);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(232, 228, 222, 0.72)";

  for (let y = 96; y < 960; y += 96) {
    for (let x = 96; x < 960; x += 96) {
      if ((x * 3 + y * 5) % 7 < 3) {
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
    }
  }

  const gradient = ctx.createRadialGradient(512, 512, 72, 512, 512, 640);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  gradient.addColorStop(0.48, "rgba(91, 185, 210, 0.09)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = anisotropy;
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  return texture;
}

function createEngravingTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(232, 228, 222, 0.62)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 96px Arial, sans-serif";
  ctx.fillText("4 GB", 512, 454);
  ctx.font = "700 54px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("NAME0x0", 512, 536);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = anisotropy;
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  return texture;
}

export function Die() {
  const groupRef = useRef<Group>(null);
  const substrateMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const circuitMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const engravingMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const shadowRef = useRef<Group>(null);
  const progressRef = useRef(filmProgressStore.getSnapshot());
  const store = useFilmProgress();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);
  const targetPosition = useMemo(() => new Vector3(), []);
  const shadowTargetPosition = useMemo(() => new Vector3(), []);
  const cameraPosition = useMemo(() => new Vector3(), []);
  const cameraTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const baseColor = useMemo(() => new Color("#161616"), []);
  const circuitTexture = useMemo(
    () => createCircuitTexture(gl.capabilities.getMaxAnisotropy()),
    [gl],
  );
  const engravingTexture = useMemo(
    () => createEngravingTexture(gl.capabilities.getMaxAnisotropy()),
    [gl],
  );

  useEffect(() => store.subscribe((progress) => {
    progressRef.current = progress;
  }), [store]);

  useEffect(() => () => {
    circuitTexture.dispose();
    engravingTexture.dispose();
  }, [circuitTexture, engravingTexture]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const substrateMaterial = substrateMaterialRef.current;
    const circuitMaterial = circuitMaterialRef.current;
    const engravingMaterial = engravingMaterialRef.current;
    const shadow = shadowRef.current;

    if (!group || !substrateMaterial || !circuitMaterial || !engravingMaterial || !shadow) {
      return;
    }

    const progress = progressRef.current;
    const active = progress.chapter === 0 ? progress.chapterLocal : 1;
    const fade = 1 - active * 0.75;
    const time = clock.elapsedTime;
    const ease = active * active * (3 - 2 * active);
    const aspect = viewport.width / Math.max(viewport.height, 0.001);
    const restX = aspect < 1 ? 0 : 2.4;
    const restY = aspect < 1 ? -1.4 : 0.2;
    const damping = 1 - Math.pow(0.001, delta);

    targetPosition.set(restX + ease * 0.22, restY - ease * 0.08, 0);
    group.position.lerp(targetPosition, damping);
    group.rotation.x = -0.08 + Math.sin(time * 0.42) * 0.012 - ease * 0.03;
    group.rotation.y = -0.28 + Math.sin(time * 0.32) * 0.025 + ease * 0.22;
    group.rotation.z = Math.sin(time * 0.28) * 0.008;
    group.scale.setScalar(1.12 - ease * 0.12);

    substrateMaterial.opacity = fade;
    substrateMaterial.roughness = 0.5 + ease * 0.12;
    substrateMaterial.color.copy(baseColor).multiplyScalar(0.98 + fade * 0.1);
    circuitMaterial.opacity = fade;
    circuitMaterial.emissiveIntensity = 0.18;
    engravingMaterial.opacity = fade * 0.9;
    engravingMaterial.emissiveIntensity = 0.08;
    shadowTargetPosition.set(group.position.x, -0.18, group.position.z);
    shadow.position.lerp(shadowTargetPosition, damping);
    shadow.scale.setScalar(1.3 - ease * 0.2);

    cameraPosition.set(1.2 + ease * 0.8, 4.2 - ease * 1.6, 7 - ease * 3.2);
    camera.position.lerp(cameraPosition, damping);
    cameraTarget.set(group.position.x, group.position.y, group.position.z);
    camera.lookAt(cameraTarget);
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[1.8, 5, 3.5]} intensity={3.2} color="#f2ede4" />
      <directionalLight position={[0, 2.4, 5.2]} intensity={0.35} color="#e8e4de" />
      <pointLight position={[4.4, 1.8, -2.2]} intensity={2} color="#d66b42" />
      <pointLight position={[3.4, 2.3, 2.8]} intensity={1.2} color="#5bb9d2" />
      <group ref={groupRef} position={[2.4, 0.2, 0]} rotation={[-0.08, -0.28, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 2.2, 18, 2, 18]} />
          <meshPhysicalMaterial
            ref={substrateMaterialRef}
            color="#161616"
            emissive="#050505"
            emissiveIntensity={0.03}
            metalness={0.48}
            opacity={1}
            roughness={0.5}
            transparent
            clearcoat={0.42}
            clearcoatRoughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.08, 2.08, 1, 1]} />
          <meshPhysicalMaterial
            ref={circuitMaterialRef}
            map={circuitTexture}
            roughnessMap={circuitTexture}
            emissiveMap={circuitTexture}
            color="#c8c0b4"
            emissive="#4aa8bd"
            emissiveIntensity={0.18}
            metalness={0.36}
            roughness={0.5}
            transparent
            opacity={1}
            depthWrite={false}
            clearcoat={0.52}
            clearcoatRoughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.069, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.02, 2.02, 1, 1]} />
          <meshPhysicalMaterial
            ref={engravingMaterialRef}
            map={engravingTexture}
            color="#e8e4de"
            emissive="#e8e4de"
            emissiveIntensity={0.08}
            metalness={0.2}
            roughness={0.72}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group ref={shadowRef} position={[2.4, -0.18, 0]}>
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.34}
          scale={3.6}
          blur={2.8}
          far={4}
          frames={1}
          color="#000000"
        />
      </group>
    </>
  );
}
