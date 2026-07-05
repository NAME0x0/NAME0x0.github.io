"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Box3,
  Color,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { FilmProgress } from "@/lib/film/progress";
import { smoothstepRange } from "./staging";

type CardProps = {
  progressRef: MutableRefObject<FilmProgress>;
  cardDimmingRef: MutableRefObject<number>;
};

type MaterialRecord = {
  material: MeshStandardMaterial;
  color: Color;
  emissive: Color;
  emissiveIntensity: number;
  opacity: number;
  assemblyOpacity: number;
};

type ObjectRecord = {
  object: Object3D;
  position: Vector3;
  scale: Vector3;
  visible: boolean;
  materials: MaterialRecord[];
  ghosts: GhostRecord[];
};

type GhostRecord = {
  line: LineSegments;
  geometry: EdgesGeometry;
  material: LineBasicMaterial;
};

type AssemblyRecords = {
  body: ObjectRecord[];
  motherboard: ObjectRecord[];
  backShield: ObjectRecord[];
  ports: ObjectRecord[];
  heatsink: ObjectRecord[];
  fanHolders: ObjectRecord[];
  fans: ObjectRecord[];
  covers: ObjectRecord[];
};

const GROUP_PATTERNS = {
  body: [/body/i],
  motherboard: [/motherboard/i, /pcb/i],
  backShield: [/back_shield/i, /back.*shield/i],
  ports: [/ports?/i, /io/i],
  heatsink: [/heatsink_front/i, /heatsink/i],
  fanHolders: [/fan_holder/i, /fan_ring/i],
  fans: [/^fan$/i, /^fan_2$/i, /fan_RTX/i, /fan_2_RTX/i],
  covers: [/cover/i],
} as const;

const BONE = "#C4B5A0";

function assemblyForChapter(chapter: number, chapterLocal: number, assembleChapter: number, end = 0.55) {
  if (chapter > assembleChapter) {
    return 1;
  }

  if (chapter < assembleChapter) {
    return 0;
  }

  return smoothstepRange(0.15, end, chapterLocal);
}

function collectMaterials(root: Object3D) {
  const records: MaterialRecord[] = [];
  const byMaterial = new Map<Material, MaterialRecord>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];

    materials.forEach((material: Material) => {
      const standard = material as MeshStandardMaterial;

      if (!standard.color) {
        return;
      }

      records.push({
        material: standard,
        color: standard.color.clone(),
        emissive: standard.emissive?.clone() ?? new Color("#000000"),
        emissiveIntensity: standard.emissiveIntensity ?? 0,
        opacity: standard.opacity ?? 1,
        assemblyOpacity: 1,
      });
      byMaterial.set(standard, records[records.length - 1]);
      standard.transparent = true;
      standard.envMapIntensity = Math.max(standard.envMapIntensity ?? 1, 1.35);
    });
  });

  return { records, byMaterial };
}

function matchesAny(name: string, patterns: readonly RegExp[]) {
  return patterns.some((pattern) => pattern.test(name));
}

function cloneMaterials(root: Object3D) {
  root.traverse((object) => {
    const mesh = object as Mesh;

    if (!mesh.material) {
      return;
    }

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((material) => material.clone());
    } else {
      mesh.material = mesh.material.clone();
    }
  });
}

function isAssemblyCandidate(object: Object3D) {
  return object.type !== "Bone" && object.type !== "Scene";
}

function hasMatchedAncestor(object: Object3D, matches: Object3D[]) {
  let parent = object.parent;

  while (parent) {
    if (matches.includes(parent)) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

function classify(root: Object3D) {
  const groups: Record<keyof typeof GROUP_PATTERNS, Object3D[]> = {
    body: [],
    motherboard: [],
    backShield: [],
    ports: [],
    heatsink: [],
    fanHolders: [],
    fans: [],
    covers: [],
  };

  root.traverse((object) => {
    const name = object.name || "";

    if (!isAssemblyCandidate(object)) {
      return;
    }

    (Object.keys(GROUP_PATTERNS) as Array<keyof typeof GROUP_PATTERNS>).forEach((key) => {
      if (matchesAny(name, GROUP_PATTERNS[key]) && !hasMatchedAncestor(object, groups[key])) {
        groups[key].push(object);
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    (Object.keys(groups) as Array<keyof typeof groups>).forEach((key) => {
      if (groups[key].length === 0) {
        console.warn(`rtx3080.glb: no meshes matched ${key}; treating as already assembled.`);
      }
    });
  }

  return groups;
}

function collectObjectMaterials(object: Object3D, byMaterial: Map<Material, MaterialRecord>) {
  const records: MaterialRecord[] = [];

  object.traverse((child) => {
    const mesh = child as Mesh;
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];

    materials.forEach((material) => {
      const record = byMaterial.get(material);

      if (record) {
        records.push(record);
      }
    });
  });

  return records;
}

function createGhosts(object: Object3D) {
  const ghosts: GhostRecord[] = [];
  // Snapshot meshes BEFORE mutating the tree: three.js traverse is live-recursive,
  // so adding the ghost line as a child mid-traverse visits the ghost itself and
  // spawns ghosts-of-ghosts until the stack overflows (and the FilmErrorBoundary
  // silently swallows the crash, hiding the whole card).
  const meshes: Mesh[] = [];

  object.traverse((child) => {
    const mesh = child as Mesh;

    if (mesh.isMesh && mesh.geometry) {
      meshes.push(mesh);
    }
  });

  meshes.forEach((mesh) => {
    const geometry = new EdgesGeometry(mesh.geometry, 30);
    const material = new LineBasicMaterial({
      color: BONE,
      transparent: true,
      opacity: 0.3,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const line = new LineSegments(geometry, material);

    mesh.add(line);
    ghosts.push({ line, geometry, material });
  });

  return ghosts;
}

function createRecords(objects: Object3D[], byMaterial: Map<Material, MaterialRecord>) {
  return objects.map((object) => ({
    object,
    position: object.position.clone(),
    scale: object.scale.clone(),
    visible: object.visible,
    materials: collectObjectMaterials(object, byMaterial),
    ghosts: createGhosts(object),
  }));
}

function applyAssembly(records: ObjectRecord[], value: number) {
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];

    record.object.visible = record.visible;
    record.object.position.copy(record.position);
    record.object.scale.copy(record.scale);

    for (let materialIndex = 0; materialIndex < record.materials.length; materialIndex += 1) {
      record.materials[materialIndex].assemblyOpacity = value;
    }

    for (let ghostIndex = 0; ghostIndex < record.ghosts.length; ghostIndex += 1) {
      record.ghosts[ghostIndex].material.opacity = (1 - value) * 0.3;
      record.ghosts[ghostIndex].line.visible = value < 0.995;
    }
  }
}

export function Card({ progressRef, cardDimmingRef }: CardProps) {
  const rootRef = useRef<Group>(null);
  const fadeRef = useRef(0);
  const spinProgressRef = useRef(0);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const pointer = useThree((state) => state.pointer);
  const camera = useThree((state) => state.camera);
  const gltf = useGLTF("/models/rtx3080.glb", false, false, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mixer = useMemo(() => new AnimationMixer(gltf.scene), [gltf.scene]);
  const bounds = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene]);
  const center = useMemo(() => bounds.getCenter(new Vector3()), [bounds]);
  const size = useMemo(() => bounds.getSize(new Vector3()), [bounds]);
  const longest = Math.max(size.x, size.y, size.z, 0.001);
  const normalizeScale = 3.4 / longest;
  const screenCenter = useMemo(() => new Vector3(), []);
  const materialData = useMemo(() => {
    cloneMaterials(gltf.scene);

    return collectMaterials(gltf.scene);
  }, [gltf.scene]);
  const materials = materialData.records;
  const groups = useMemo(() => classify(gltf.scene), [gltf.scene]);
  const assemblyRecords = useMemo<AssemblyRecords>(() => ({
    body: createRecords(groups.body, materialData.byMaterial),
    motherboard: createRecords(groups.motherboard, materialData.byMaterial),
    backShield: createRecords(groups.backShield, materialData.byMaterial),
    ports: createRecords(groups.ports, materialData.byMaterial),
    heatsink: createRecords(groups.heatsink, materialData.byMaterial),
    fanHolders: createRecords(groups.fanHolders, materialData.byMaterial),
    fans: createRecords(groups.fans, materialData.byMaterial),
    covers: createRecords(groups.covers, materialData.byMaterial),
  }), [groups, materialData.byMaterial]);
  const allRecords = useMemo(
    () => [
      ...assemblyRecords.body,
      ...assemblyRecords.motherboard,
      ...assemblyRecords.backShield,
      ...assemblyRecords.ports,
      ...assemblyRecords.heatsink,
      ...assemblyRecords.fanHolders,
      ...assemblyRecords.fans,
      ...assemblyRecords.covers,
    ],
    [assemblyRecords],
  );
  const clips = useMemo(() => {
    const result: Record<string, AnimationClip | undefined> = {};

    gltf.animations.forEach((clip) => {
      if (/static/i.test(clip.name)) result.static = clip;
      if (/600rpm/i.test(clip.name)) result.rpm600 = clip;
      if (/1200rpm/i.test(clip.name)) result.rpm1200 = clip;
      if (/1500rpm/i.test(clip.name)) result.rpm1500 = clip;
    });

    return result;
  }, [gltf.animations]);

  useEffect(() => () => {
    for (let recordIndex = 0; recordIndex < allRecords.length; recordIndex += 1) {
      const record = allRecords[recordIndex];

      for (let ghostIndex = 0; ghostIndex < record.ghosts.length; ghostIndex += 1) {
        record.ghosts[ghostIndex].geometry.dispose();
        record.ghosts[ghostIndex].material.dispose();
      }
    }

      mixer.stopAllAction();
  }, [allRecords, mixer]);

  useFrame((_, delta) => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const { chapter, chapterLocal } = progressRef.current;
    const dimming = cardDimmingRef.current;
    const body = Math.max(
      assemblyForChapter(chapter, chapterLocal, 1),
      groups.body.length === 0 ? 1 : 0,
    );
    const motherboard = Math.max(
      assemblyForChapter(chapter, chapterLocal, 1),
      groups.motherboard.length === 0 ? 1 : 0,
    );
    const backShield = Math.max(
      assemblyForChapter(chapter, chapterLocal, 1),
      groups.backShield.length === 0 ? 1 : 0,
    );
    const ports = Math.max(assemblyForChapter(chapter, chapterLocal, 2), groups.ports.length === 0 ? 1 : 0);
    const heatsink = Math.max(assemblyForChapter(chapter, chapterLocal, 3), groups.heatsink.length === 0 ? 1 : 0);
    const fanHolders = Math.max(assemblyForChapter(chapter, chapterLocal, 4), groups.fanHolders.length === 0 ? 1 : 0);
    const fans = Math.max(assemblyForChapter(chapter, chapterLocal, 6, 0.7), groups.fans.length === 0 ? 1 : 0);
    const covers = Math.max(assemblyForChapter(chapter, chapterLocal, 6, 0.7), groups.covers.length === 0 ? 1 : 0);
    const complete = body >= 1 && motherboard >= 1 && backShield >= 1 && ports >= 1 && heatsink >= 1 && fanHolders >= 1 && fans >= 1 && covers >= 1;
    const damping = 1 - Math.pow(0.001, delta);

    root.getWorldPosition(screenCenter);
    screenCenter.project(camera);
    const dx = pointer.x - screenCenter.x;
    const dy = pointer.y - screenCenter.y;
    const proximity = 1 - smoothstepRange(0.22, 0.72, Math.sqrt(dx * dx + dy * dy));
    const targetTiltX = -dy * 0.06 * proximity;
    const targetTiltY = dx * 0.06 * proximity;

    tiltRef.current.x += (targetTiltX - tiltRef.current.x) * damping;
    tiltRef.current.y += (targetTiltY - tiltRef.current.y) * damping;
    root.rotation.set(tiltRef.current.x, -Math.PI / 2 + tiltRef.current.y, 0);
    fadeRef.current += (1 - fadeRef.current) * damping;
    root.visible = true;

    applyAssembly(assemblyRecords.body, body);
    applyAssembly(assemblyRecords.motherboard, motherboard);
    applyAssembly(assemblyRecords.backShield, backShield);
    applyAssembly(assemblyRecords.ports, ports);
    applyAssembly(assemblyRecords.heatsink, heatsink);
    applyAssembly(assemblyRecords.fanHolders, fanHolders);
    applyAssembly(assemblyRecords.fans, fans);
    applyAssembly(assemblyRecords.covers, covers);

    for (let index = 0; index < materials.length; index += 1) {
      const record = materials[index];
      const factor = fadeRef.current * (1 - dimming);

      record.material.color.setRGB(record.color.r * factor, record.color.g * factor, record.color.b * factor);
      record.material.opacity = record.opacity * Math.max(0.04, fadeRef.current) * record.assemblyOpacity;
      if (record.material.emissive) {
        record.material.emissive.setRGB(record.emissive.r * factor, record.emissive.g * factor, record.emissive.b * factor);
        record.material.emissiveIntensity = record.emissiveIntensity * factor;
      }
    }

    spinProgressRef.current = complete ? Math.min(1, spinProgressRef.current + delta / 2) : 0;

    const desiredClip = spinProgressRef.current > 0.5
      ? clips.rpm1200 ?? clips.rpm1500
      : spinProgressRef.current > 0.05
        ? clips.rpm600
        : clips.static;

    if (desiredClip) {
      const nextAction = mixer.clipAction(desiredClip);

      if (activeActionRef.current !== nextAction) {
        nextAction.reset().fadeIn(0.35).play();
        activeActionRef.current?.fadeOut(0.35);
        activeActionRef.current = nextAction;
      }
    }

    mixer.update(delta);
  });

  // Portrait orientation: model +X face normal maps to world +Z, while model Y remains the vertical long axis.
  return (
    <group ref={rootRef} visible={false} scale={normalizeScale} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={gltf.scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

useGLTF.preload("/models/rtx3080.glb", false, false, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
