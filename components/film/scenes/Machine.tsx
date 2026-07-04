"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  Object3D,
  InstancedMesh,
  PointLight,
  Points,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { filmProgressStore, useFilmProgress } from "@/lib/film/progress";
import { FilmErrorBoundary } from "../FilmErrorBoundary";
import { Card } from "./Card";
import { Council } from "./Council";
import { Cosmos } from "./Cosmos";
import { Torus } from "./Torus";
import { sampleRail, narrowRail, wideRail, type RailSample } from "./rail";
import { layerPresence, smoothstep, smoothstepRange } from "./staging";

const SIGNAL = "#E3B341";
const DIM = "#8A8578";
const EMBER = "#D08C5A";
const BONE = "#C4B5A0";
const INK = "#E8E4DE";
const MOTE_COUNT = 320;
const PAD_COUNT = 48;

const BENCHMARKS = [
  { label: "ARC-C 82.0", value: 0.82, z: -0.58, width: 0.13, color: SIGNAL },
  { label: "ARC-E 92.0", value: 0.92, z: 0, width: 0.15, color: SIGNAL },
  { label: "Llama 3.2 78.6", value: 0.786, z: 0.58, width: 0.08, color: DIM },
] as const;

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
  const cardGroupRef = useRef<Group>(null);
  const dieGroupRef = useRef<Group>(null);
  const shadowRef = useRef<Group>(null);
  const substrateMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const dieMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const circuitMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const padsRef = useRef<InstancedMesh>(null);
  const padsMaterialRef = useRef<MeshPhysicalMaterial>(null);
  const padsReadyRef = useRef(false);
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
  const cardDimmingRef = useRef(0);
  const proceduralOpacityRef = useRef(1);
  const [cardLoaded, setCardLoaded] = useState(false);
  const store = useFilmProgress();
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);
  const targetPosition = useMemo(() => new Vector3(), []);
  const cardTargetPosition = useMemo(() => new Vector3(), []);
  const shadowTargetPosition = useMemo(() => new Vector3(), []);
  const cameraPosition = useMemo(() => new Vector3(), []);
  const cameraTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const wideStage = useMemo(() => new Vector3(2.5, 0, 0), []);
  const narrowStage = useMemo(() => new Vector3(0, -1.6, 0), []);
  const stageOffset = useMemo(() => new Vector3(), []);
  const railSample = useMemo<RailSample>(() => ({
    cameraPosition: new Vector3(),
    lookAt: new Vector3(),
    cardPosition: new Vector3(),
    cardScale: 1,
    cardDimming: 0,
  }), []);
  const padDummy = useMemo(() => new Object3D(), []);
  const baseColor = useMemo(() => new Color("#141210"), []);
  const circuitTexture = useMemo(
    () => createCircuitTexture(gl.capabilities.getMaxAnisotropy()),
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
    glowTexture.dispose();
    labelTextures.forEach((texture) => texture.dispose());
    moteField.geometry.dispose();
  }, [circuitTexture, glowTexture, labelTextures, moteField]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const cardGroup = cardGroupRef.current;
    const dieGroup = dieGroupRef.current;
    const shadow = shadowRef.current;
    const substrateMaterial = substrateMaterialRef.current;
    const dieMaterial = dieMaterialRef.current;
    const circuitMaterial = circuitMaterialRef.current;
    const pads = padsRef.current;
    const padsMaterial = padsMaterialRef.current;
    const ambientLight = ambientLightRef.current;
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const rimLight = rimLightRef.current;
    const cyanLight = cyanLightRef.current;
    const motes = motesRef.current;
    const motesMaterial = motesMaterialRef.current;

    if (
      !group ||
      !cardGroup ||
      !dieGroup ||
      !shadow ||
      !substrateMaterial ||
      !dieMaterial ||
      !circuitMaterial ||
      !pads ||
      !padsMaterial ||
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
    const mindPresence = layerPresence(chapter, local, 3);
    const councilPresence = layerPresence(chapter, local, 4);
    const lightPresence = chapter === 6
      ? smoothstepRange(0, 0.5, local)
      : chapter === 7
        ? 1 - smoothstepRange(0, 0.3, local)
        : 0;
    const activeColumns = mindPresence;
    const powerDown = chapter === 7 ? smoothstep(local / 0.5) : 0;
    const lightScale = 1 - powerDown * 0.85;
    const aspect = viewport.width / Math.max(viewport.height, 0.001);
    const isNarrow = aspect < 1.05;
    const activeStage = isNarrow ? narrowStage : wideStage;
    const distanceScale = isNarrow ? 1.3 : 1;
    const azimuthScale = isNarrow ? 0.5 : 1;
    const time = clock.elapsedTime;
    const damping = 1 - Math.pow(0.001, delta);
    const track = isNarrow ? narrowRail : wideRail;

    sampleRail(track, chapter, local, railSample);
    const slide = chapter === 5
      ? smoothstepRange(0, 0.3, local) * (1 - smoothstepRange(0.7, 1, local))
      : 0;
    const dimmingTarget = railSample.cardDimming + slide * 0.75;

    cardDimmingRef.current = dimmingTarget;

    targetPosition.copy(activeStage);
    group.position.lerp(targetPosition, damping);
    cardTargetPosition.set(
      railSample.cardPosition.x - slide * 1.4,
      railSample.cardPosition.y - slide * 1.7,
      railSample.cardPosition.z + slide * 0.7,
    );
    cardGroup.position.lerp(cardTargetPosition, damping);
    cardGroup.scale.setScalar(cardGroup.scale.x + (railSample.cardScale - cardGroup.scale.x) * damping);
    dieGroup.position.y = Math.sin(time * 0.42) * 0.02;
    dieGroup.rotation.x = -0.035 + Math.sin(time * 0.3) * 0.008;
    dieGroup.rotation.y = -0.16 + Math.sin(time * 0.24) * 0.018;
    dieGroup.rotation.z = Math.sin(time * 0.22) * 0.006;

    if (!padsReadyRef.current) {
      for (let index = 0; index < PAD_COUNT; index += 1) {
        const side = Math.floor(index / 12);
        const slot = index % 12;
        const offset = -1.1 + slot * 0.2;

        if (side === 0) {
          padDummy.position.set(offset, 0.045, -1.05);
        } else if (side === 1) {
          padDummy.position.set(1.05, 0.045, offset);
        } else if (side === 2) {
          padDummy.position.set(-offset, 0.045, 1.05);
        } else {
          padDummy.position.set(-1.05, 0.045, -offset);
        }

        padDummy.scale.set(0.055, 0.014, 0.055);
        padDummy.updateMatrix();
        pads.setMatrixAt(index, padDummy.matrix);
      }

      pads.instanceMatrix.needsUpdate = true;
      padsReadyRef.current = true;
    }

    ambientLight.intensity = 0.18 * lightScale;
    keyLight.intensity = 3.2 * lightScale;
    fillLight.intensity = 0.35 * lightScale;
    rimLight.intensity = 2 * lightScale;
    cyanLight.intensity = 1.2 * lightScale;

    proceduralOpacityRef.current += ((cardLoaded ? 0 : 1) - proceduralOpacityRef.current) * damping;
    substrateMaterial.opacity = proceduralOpacityRef.current;
    padsMaterial.opacity = proceduralOpacityRef.current;
    substrateMaterial.roughness = 0.5 + chapter0 * 0.12;
    substrateMaterial.color.copy(baseColor);
    dieMaterial.opacity = 1;
    dieMaterial.roughness = 0.46;

    const bootFlash = chapter === 3 && local < 0.6 ? Math.sin((local / 0.6) * Math.PI) : 0;
    const circuitIntensity = 0.18 + mindPresence * 0.17 + bootFlash * 0.25;
    circuitMaterial.opacity = 1 - powerDown * 0.75;
    circuitMaterial.emissiveIntensity = circuitIntensity * (1 - powerDown) + 0.02 * powerDown;

    shadowTargetPosition.set(group.position.x, -0.18, group.position.z);
    shadow.position.lerp(shadowTargetPosition, damping);
    shadow.scale.setScalar(1.05);

    stageOffset.copy(railSample.cameraPosition);
    cameraPosition.set(
      group.position.x + stageOffset.x * azimuthScale * distanceScale,
      group.position.y + stageOffset.y,
      group.position.z + stageOffset.z * distanceScale,
    );
    camera.position.lerp(cameraPosition, damping);
    cameraTarget.set(
      group.position.x + railSample.lookAt.x,
      group.position.y + railSample.lookAt.y,
      group.position.z + railSample.lookAt.z,
    );
    camera.lookAt(cameraTarget);

    for (let index = 0; index < BENCHMARKS.length; index += 1) {
      const benchmark = BENCHMARKS[index];
      const column = columnsRef.current[index];
      const core = coresRef.current[index];
      const base = basesRef.current[index];
      const label = labelsRef.current[index];
      const grow = smoothstep((mindPresence - index * 0.1) / 0.72);
      const height = benchmark.value * 1.75 * grow;
      const opacity = 0.55 * grow * activeColumns;

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

    const motePresence = Math.max(mindPresence, councilPresence, lightPresence);
    const positionAttribute = moteField.geometry.getAttribute("position") as BufferAttribute;
    const positions = moteField.positions;
    const seeds = moteField.seeds;
    const moteColor = lightPresence > Math.max(mindPresence, councilPresence) ? INK : mindPresence >= councilPresence ? SIGNAL : BONE;

    for (let index = 0; index < MOTE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const seedIndex = index * 4;
      const rise = (seeds[seedIndex + 2] + time * 0.045 * seeds[seedIndex + 3]) % 1;
      const sway = Math.sin(time * 0.52 + seeds[seedIndex + 2] * 6.283) * 0.035;

      positions[positionIndex] = seeds[seedIndex] * 0.62 + sway;
      positions[positionIndex + 1] = 0.16 + rise * 1.72;
      positions[positionIndex + 2] = seeds[seedIndex + 1] * 0.62;
    }

    positionAttribute.needsUpdate = true;
    motesMaterial.color.set(moteColor);
    motesMaterial.opacity = 0.32 * motePresence * lightScale;
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.18} />
      <directionalLight ref={keyLightRef} position={[1.8, 5, 3.5]} intensity={3.2} color="#f2ede4" />
      <directionalLight ref={fillLightRef} position={[0, 2.4, 5.2]} intensity={0.35} color="#e8e4de" />
      <pointLight ref={rimLightRef} position={[4.4, 1.8, -2.2]} intensity={2} color={EMBER} />
      <pointLight ref={cyanLightRef} position={[3.4, 2.3, 2.8]} intensity={1.2} color="#5bb9d2" />
      <group ref={groupRef} position={[2.5, 0, 0]}>
        <group ref={cardGroupRef}>
          <group ref={dieGroupRef}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.6, 0.06, 2.6, 1, 1, 1]} />
              <meshPhysicalMaterial
                ref={substrateMaterialRef}
                color="#141210"
                emissive="#030302"
                emissiveIntensity={0.02}
                metalness={0.18}
                opacity={1}
                roughness={0.82}
                transparent
              />
            </mesh>
            <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.05, 1.6, 10, 1, 10]} />
              <meshPhysicalMaterial
                ref={dieMaterialRef}
                color="#171717"
                emissive="#050606"
                emissiveIntensity={0.04}
                metalness={0.46}
                roughness={0.46}
                transparent
                opacity={1}
                clearcoat={0.34}
                clearcoatRoughness={0.32}
              />
            </mesh>
            <mesh position={[0, 0.083, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.56, 1.56, 1, 1]} />
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
            <instancedMesh ref={padsRef} args={[undefined, undefined, PAD_COUNT]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                ref={padsMaterialRef}
                color={BONE}
                metalness={0.62}
                opacity={1}
                roughness={0.38}
                transparent
              />
            </instancedMesh>
          </group>
          <FilmErrorBoundary>
            <Suspense fallback={null}>
              <Card progressRef={progressRef} cardDimmingRef={cardDimmingRef} onLoaded={() => setCardLoaded(true)} />
            </Suspense>
          </FilmErrorBoundary>
        </group>
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
        <Council progressRef={progressRef} glowTexture={glowTexture} />
        <Torus progressRef={progressRef} glowTexture={glowTexture} />
        <Cosmos progressRef={progressRef} glowTexture={glowTexture} />
      </group>
      <group ref={shadowRef} position={[2.5, -0.18, 0]}>
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
