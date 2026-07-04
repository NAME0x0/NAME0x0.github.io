"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Box3,
  Color,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { FilmProgress } from "@/lib/film/progress";
import { smoothstepRange } from "./staging";

type CardProps = {
  progressRef: MutableRefObject<FilmProgress>;
  cardDimmingRef: MutableRefObject<number>;
  onLoaded?: () => void;
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
  quaternion: Quaternion;
  scale: Vector3;
  offset: Vector3;
  visible: boolean;
  materials: MaterialRecord[];
};

type AssemblyRecords = {
  structure: ObjectRecord[];
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

function assemblyForChapter(chapter: number, chapterLocal: number, assembleChapter: number) {
  if (chapter > assembleChapter) {
    return 1;
  }

  if (chapter < assembleChapter) {
    return 0;
  }

  return smoothstepRange(0.15, 0.55, chapterLocal);
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

function createRecords(
  objects: Object3D[],
  byMaterial: Map<Material, MaterialRecord>,
  normalizeScale: number,
  offsetScale: number,
) {
  const cardLength = 3.4;
  const sourceYOffset = (cardLength * 0.35 * offsetScale) / normalizeScale;
  const sourceScatter = (cardLength * 0.04) / normalizeScale;
  const parentPosition = new Vector3();
  const parentQuaternion = new Quaternion();
  const parentScale = new Vector3();

  return objects.map((object, index) => {
    const offset = new Vector3(
      ((index % 3) - 1) * sourceScatter,
      -sourceYOffset,
      (((index * 2) % 3) - 1) * sourceScatter,
    );

    object.parent?.updateWorldMatrix(true, false);
    object.parent?.matrixWorld.decompose(parentPosition, parentQuaternion, parentScale);
    offset.applyQuaternion(parentQuaternion.invert()).divide(parentScale);

    return {
      object,
      position: object.position.clone(),
      quaternion: object.quaternion.clone(),
      scale: object.scale.clone(),
      offset,
      visible: object.visible,
      materials: collectObjectMaterials(object, byMaterial),
    };
  });
}

function applyAssembly(records: ObjectRecord[], value: number) {
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const hidden = 1 - value;

    record.object.visible = record.visible && value > 0.01;
    record.object.position.set(
      record.position.x + record.offset.x * hidden,
      record.position.y + record.offset.y * hidden,
      record.position.z + record.offset.z * hidden,
    );
    record.object.quaternion.copy(record.quaternion);
    record.object.scale.copy(record.scale);

    for (let materialIndex = 0; materialIndex < record.materials.length; materialIndex += 1) {
      record.materials[materialIndex].assemblyOpacity = value;
    }
  }
}

export function Card({ progressRef, cardDimmingRef, onLoaded }: CardProps) {
  const rootRef = useRef<Group>(null);
  const loadedRef = useRef(false);
  const fadeRef = useRef(0);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const gltf = useGLTF("/models/rtx3080.glb", false, false, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mixer = useMemo(() => new AnimationMixer(gltf.scene), [gltf.scene]);
  const bounds = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene]);
  const center = useMemo(() => bounds.getCenter(new Vector3()), [bounds]);
  const size = useMemo(() => bounds.getSize(new Vector3()), [bounds]);
  const longest = Math.max(size.x, size.y, size.z, 0.001);
  const normalizeScale = 3.4 / longest;
  const materialData = useMemo(() => {
    cloneMaterials(gltf.scene);

    return collectMaterials(gltf.scene);
  }, [gltf.scene]);
  const materials = materialData.records;
  const groups = useMemo(() => classify(gltf.scene), [gltf.scene]);
  const assemblyRecords = useMemo<AssemblyRecords>(() => ({
    structure: createRecords(
      [...groups.body, ...groups.motherboard, ...groups.backShield],
      materialData.byMaterial,
      normalizeScale,
      1,
    ),
    ports: createRecords(groups.ports, materialData.byMaterial, normalizeScale, 0.95),
    heatsink: createRecords(groups.heatsink, materialData.byMaterial, normalizeScale, 0.85),
    fanHolders: createRecords(groups.fanHolders, materialData.byMaterial, normalizeScale, 0.9),
    fans: createRecords(groups.fans, materialData.byMaterial, normalizeScale, 1),
    covers: createRecords(groups.covers, materialData.byMaterial, normalizeScale, 1.05),
  }), [groups, materialData.byMaterial, normalizeScale]);
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

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      onLoaded?.();
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, onLoaded]);

  useFrame((_, delta) => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const { chapter, chapterLocal } = progressRef.current;
    const dimming = cardDimmingRef.current;
    const structure = Math.max(
      assemblyForChapter(chapter, chapterLocal, 1),
      groups.body.length === 0 && groups.motherboard.length === 0 && groups.backShield.length === 0 ? 1 : 0,
    );
    const ports = Math.max(assemblyForChapter(chapter, chapterLocal, 2), groups.ports.length === 0 ? 1 : 0);
    const heatsink = Math.max(assemblyForChapter(chapter, chapterLocal, 3), groups.heatsink.length === 0 ? 1 : 0);
    const fanHolders = Math.max(assemblyForChapter(chapter, chapterLocal, 4), groups.fanHolders.length === 0 ? 1 : 0);
    const fans = Math.max(assemblyForChapter(chapter, chapterLocal, 6), groups.fans.length === 0 ? 1 : 0);
    const covers = Math.max(assemblyForChapter(chapter, chapterLocal, 7), groups.covers.length === 0 ? 1 : 0);

    fadeRef.current += (1 - fadeRef.current) * (1 - Math.pow(0.001, delta));
    root.visible = true;

    applyAssembly(assemblyRecords.structure, structure);
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

    const desiredClip = chapter >= 7
      ? clips.static
      : chapter === 6 && chapterLocal > 0.68
        ? clips.rpm1200 ?? clips.rpm1500
        : chapter === 6 && chapterLocal > 0.35
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

  return (
    <group ref={rootRef} visible={false} scale={normalizeScale} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
      <primitive object={gltf.scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

useGLTF.preload("/models/rtx3080.glb", false, false, (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
