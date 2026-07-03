"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  DirectionalLight,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PointLight,
  Points,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { filmProgressStore, useFilmProgress } from "@/lib/film/progress";

const SIGNAL = "#E3B341";
const DIM = "#8A8578";
const EMBER = "#D08C5A";
const BONE = "#C4B5A0";
const MOTE_COUNT = 400;

const BENCHMARKS = [
  { label: "ARC-C 82.0", value: 0.82, z: -0.58, width: 0.13, color: SIGNAL },
  { label: "ARC-E 92.0", value: 0.92, z: 0, width: 0.15, color: SIGNAL },
  { label: "Llama 3.2 78.6", value: 0.786, z: 0.58, width: 0.08, color: DIM },
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const x = clamp01(value);

  return x * x * (3 - 2 * x);
}

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

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 124);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  gradient.addColorStop(0.24, "rgba(255, 255, 255, 0.48)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

function createLabelTexture(text: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "700 54px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 64);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;

  return texture;
}

function createMoteField() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(MOTE_COUNT * 3);
  const seeds = new Float32Array(MOTE_COUNT * 4);

  for (let index = 0; index < MOTE_COUNT; index += 1) {
    const seedIndex = index * 4;
    const angle = ((index * 137.508) % 360) * (Math.PI / 180);
    const radius = 0.08 + ((index * 53) % 100) / 100 * 1.02;

    seeds[seedIndex] = Math.cos(angle) * radius;
    seeds[seedIndex + 1] = Math.sin(angle) * radius;
    seeds[seedIndex + 2] = ((index * 29) % 100) / 100;
    seeds[seedIndex + 3] = 0.35 + ((index * 17) % 100) / 100 * 0.65;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  return { geometry, positions, seeds };
}

export function Machine() {
  const groupRef = useRef<Group>(null);
  const shadowRef = useRef<Group>(null);
  const substrateMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const circuitMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const engravingMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const fillLightRef = useRef<DirectionalLight>(null);
  const rimLightRef = useRef<PointLight>(null);
  const cyanLightRef = useRef<PointLight>(null);
  const columnsRef = useRef<(Mesh | null)[]>([]);
  const coresRef = useRef<(Mesh | null)[]>([]);
  const basesRef = useRef<(Sprite | null)[]>([]);
  const labelsRef = useRef<(Sprite | null)[]>([]);
  const motesRef = useRef<Points>(null);
  const motesMaterialRef = useRef<PointsMaterial>(null);
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
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const labelTextures = useMemo(
    () => BENCHMARKS.map((benchmark) => createLabelTexture(benchmark.label, benchmark.color)),
    [],
  );
  const moteField = useMemo(() => createMoteField(), []);

  useEffect(() => store.subscribe((progress) => {
    progressRef.current = progress;
  }), [store]);

  useEffect(() => () => {
    circuitTexture.dispose();
    engravingTexture.dispose();
    glowTexture.dispose();
    labelTextures.forEach((texture) => texture.dispose());
    moteField.geometry.dispose();
  }, [circuitTexture, engravingTexture, glowTexture, labelTextures, moteField]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const shadow = shadowRef.current;
    const substrateMaterial = substrateMaterialRef.current;
    const circuitMaterial = circuitMaterialRef.current;
    const engravingMaterial = engravingMaterialRef.current;
    const ambientLight = ambientLightRef.current;
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const rimLight = rimLightRef.current;
    const cyanLight = cyanLightRef.current;
    const motes = motesRef.current;
    const motesMaterial = motesMaterialRef.current;

    if (
      !group ||
      !shadow ||
      !substrateMaterial ||
      !circuitMaterial ||
      !engravingMaterial ||
      !ambientLight ||
      !keyLight ||
      !fillLight ||
      !rimLight ||
      !cyanLight ||
      !motes ||
      !motesMaterial
    ) {
      return;
    }

    const progress = progressRef.current;
    const chapter = progress.chapter;
    const local = progress.chapterLocal;
    const chapter0 = chapter === 0 ? smoothstep(local) : chapter > 0 ? 1 : 0;
    const chapter3 = chapter === 3 ? smoothstep(local) : chapter > 3 ? 1 : 0;
    const activeColumns = chapter >= 3 && chapter <= 6 ? 1 : chapter === 7 ? 1 - smoothstep(local / 0.5) : 0;
    const powerDown = chapter === 7 ? smoothstep(local / 0.5) : 0;
    const lightScale = 1 - powerDown * 0.85;
    const aspect = viewport.width / Math.max(viewport.height, 0.001);
    const restX = aspect < 1 ? 0 : 2.4;
    const restY = aspect < 1 ? -1.4 : 0.2;
    const time = clock.elapsedTime;
    const damping = 1 - Math.pow(0.001, delta);

    targetPosition.set(restX + chapter0 * 0.22, restY - chapter0 * 0.08, 0);
    group.position.lerp(targetPosition, damping);
    group.rotation.x = -0.08 + Math.sin(time * 0.42) * 0.012 - chapter0 * 0.03;
    group.rotation.y = -0.28 + Math.sin(time * 0.32) * 0.025 + chapter0 * 0.22;
    group.rotation.z = Math.sin(time * 0.28) * 0.008;
    group.scale.setScalar(1.12 - chapter0 * 0.12);

    ambientLight.intensity = 0.18 * lightScale;
    keyLight.intensity = 3.2 * lightScale;
    fillLight.intensity = 0.35 * lightScale;
    rimLight.intensity = 2 * lightScale;
    cyanLight.intensity = 1.2 * lightScale;

    substrateMaterial.opacity = 1;
    substrateMaterial.roughness = 0.5 + chapter0 * 0.12;
    substrateMaterial.color.copy(baseColor).multiplyScalar(1.08);

    const bootFlash = chapter === 3 && local < 0.6 ? Math.sin((local / 0.6) * Math.PI) : 0;
    const circuitIntensity = 0.18 + chapter3 * 0.17 + bootFlash * 0.25;
    circuitMaterial.opacity = 1 - powerDown * 0.75;
    circuitMaterial.emissiveIntensity = circuitIntensity * (1 - powerDown) + 0.02 * powerDown;
    engravingMaterial.opacity = 0.9 * (1 - powerDown * 0.75);
    engravingMaterial.emissiveIntensity = Math.max(0.02, 0.08 * lightScale);

    shadowTargetPosition.set(group.position.x, -0.18, group.position.z);
    shadow.position.lerp(shadowTargetPosition, damping);
    shadow.scale.setScalar(1.3 - chapter0 * 0.2);

    if (chapter === 0) {
      cameraPosition.set(1.2 + chapter0 * 0.8, 4.2 - chapter0 * 1.6, 7 - chapter0 * 3.2);
    } else if (chapter < 3) {
      cameraPosition.set(
        2 + Math.sin(time * 0.08) * 0.14,
        2.6 + Math.sin(time * 0.05) * 0.05,
        3.8 + Math.cos(time * 0.07) * 0.12,
      );
    } else if (chapter === 3) {
      cameraPosition.set(1.6 - chapter3 * 0.8, 2.2 - chapter3 * 0.4, 4.6 - chapter3 * 1);
    } else {
      cameraPosition.set(
        0.8 + Math.sin(time * 0.06) * 0.06,
        1.8 + Math.sin(time * 0.04) * 0.04,
        3.6 + Math.cos(time * 0.05) * 0.08,
      );
    }

    camera.position.lerp(cameraPosition, damping);
    cameraTarget.set(group.position.x, group.position.y + (chapter >= 3 ? 0.55 : 0), group.position.z);
    camera.lookAt(cameraTarget);

    for (let index = 0; index < BENCHMARKS.length; index += 1) {
      const benchmark = BENCHMARKS[index];
      const column = columnsRef.current[index];
      const core = coresRef.current[index];
      const base = basesRef.current[index];
      const label = labelsRef.current[index];
      const grow = smoothstep((chapter3 - index * 0.1) / 0.72);
      const shimmer = chapter >= 4 && chapter <= 6 ? 0.9 + Math.sin(time * 1.2 + index) * 0.08 : 1;
      const height = benchmark.value * 2.15 * grow;
      const opacity = 0.55 * grow * activeColumns * shimmer;

      if (column) {
        column.position.y = 0.1 + height * 0.5;
        column.scale.y = Math.max(height, 0.001);
        (column.material as MeshBasicMaterial).opacity = opacity;
      }

      if (core) {
        core.position.y = 0.1 + height * 0.5;
        core.scale.y = Math.max(height, 0.001);
        (core.material as MeshBasicMaterial).opacity = opacity * 0.88;
      }

      if (base) {
        (base.material as SpriteMaterial).opacity = 0.42 * grow * activeColumns;
      }

      if (label) {
        label.position.y = 0.34 + height;
        (label.material as SpriteMaterial).opacity = 0.82 * grow * activeColumns;
      }
    }

    const motePresence = chapter >= 3 && chapter <= 6 ? chapter3 : chapter === 7 ? 1 - powerDown : 0;
    const positionAttribute = moteField.geometry.getAttribute("position") as BufferAttribute;
    const positions = moteField.positions;
    const seeds = moteField.seeds;

    for (let index = 0; index < MOTE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const seedIndex = index * 4;
      const rise = (seeds[seedIndex + 2] + time * 0.045 * seeds[seedIndex + 3]) % 1;
      const sway = Math.sin(time * 0.52 + seeds[seedIndex + 2] * 6.283) * 0.035;

      positions[positionIndex] = 0.45 + seeds[seedIndex] * 0.58 + sway;
      positions[positionIndex + 1] = 0.12 + rise * 1.95;
      positions[positionIndex + 2] = seeds[seedIndex + 1] * 0.88;
    }

    positionAttribute.needsUpdate = true;
    motesMaterial.opacity = 0.38 * motePresence * lightScale;
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.18} />
      <directionalLight ref={keyLightRef} position={[1.8, 5, 3.5]} intensity={3.2} color="#f2ede4" />
      <directionalLight ref={fillLightRef} position={[0, 2.4, 5.2]} intensity={0.35} color="#e8e4de" />
      <pointLight ref={rimLightRef} position={[4.4, 1.8, -2.2]} intensity={2} color={EMBER} />
      <pointLight ref={cyanLightRef} position={[3.4, 2.3, 2.8]} intensity={1.2} color="#5bb9d2" />
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
        <points ref={motesRef} geometry={moteField.geometry}>
          <pointsMaterial
            ref={motesMaterialRef}
            map={glowTexture}
            color={BONE}
            size={0.05}
            sizeAttenuation
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </points>
        {BENCHMARKS.map((benchmark, index) => (
          <group key={benchmark.label} position={[0.92, 0.08, benchmark.z]}>
            <mesh ref={(node) => { columnsRef.current[index] = node; }} scale={[benchmark.width, 0.001, benchmark.width]} position={[0, 0.1, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh ref={(node) => { coresRef.current[index] = node; }} scale={[benchmark.width * 0.28, 0.001, benchmark.width * 0.28]} position={[0, 0.1, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <sprite ref={(node) => { basesRef.current[index] = node; }} scale={[0.74, 0.74, 1]} rotation={[0, 0, 0]}>
              <spriteMaterial
                map={glowTexture}
                color={benchmark.color}
                transparent
                opacity={0}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
            <sprite ref={(node) => { labelsRef.current[index] = node; }} position={[0.08, 0.34, 0]} scale={[0.78, 0.2, 1]}>
              <spriteMaterial
                map={labelTextures[index]}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </sprite>
          </group>
        ))}
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
