// Adapted from ReactBits InfiniteMenu by David Haz, MIT License.
"use client";

import { mat4, quat, vec3 } from "gl-matrix";
import { useEffect, useRef, useState } from "react";
import type { PhotoEntry } from "@/lib/content/photos";

type InfiniteSphereProps = {
  photos: PhotoEntry[];
};

const vertexShader = `#version 300 es
precision highp float;
uniform mat4 uProjection;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec3 aCenter;
layout(location = 3) in float aPhotoIndex;
out vec2 vUv;
out float vAlpha;
flat out int vPhotoIndex;
void main() {
  float depth = smoothstep(-1.5, 1.7, aCenter.z);
  float size = mix(0.24, 0.46, depth);
  vec3 viewPosition = vec3(aCenter.xy + aCorner * size, aCenter.z - 4.25);
  gl_Position = uProjection * vec4(viewPosition, 1.0);
  vUv = aUv;
  vAlpha = mix(0.22, 1.0, depth);
  vPhotoIndex = int(aPhotoIndex);
}`;

const fragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform int uAtlasSize;
in vec2 vUv;
in float vAlpha;
flat in int vPhotoIndex;
out vec4 outColor;
void main() {
  int cellX = vPhotoIndex - (vPhotoIndex / uAtlasSize) * uAtlasSize;
  int cellY = vPhotoIndex / uAtlasSize;
  vec2 cellSize = vec2(1.0 / float(uAtlasSize));
  vec2 uv = (vec2(float(cellX), float(cellY)) + vUv) * cellSize;
  vec4 color = texture(uAtlas, uv);
  outColor = vec4(color.rgb, color.a * vAlpha);
}`;

const kindLabel: Record<PhotoEntry["kind"], string> = {
  professional: "headshot",
  profile: "profile",
  goofy: "off duty",
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) throw new Error("Unable to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
  const program = gl.createProgram();

  if (!program) throw new Error("Unable to create program");

  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Program link failed");
  }

  return program;
}

function createSphereCenters(count: number) {
  const centers = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(count - 1, 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * golden;
    const offset = index * 3;

    centers[offset] = Math.cos(theta) * radius * 1.58;
    centers[offset + 1] = y * 1.58;
    centers[offset + 2] = Math.sin(theta) * radius * 1.58;
  }

  return centers;
}

async function createAtlas(gl: WebGL2RenderingContext, photos: PhotoEntry[]) {
  const atlasSize = Math.ceil(Math.sqrt(Math.max(photos.length, 1)));
  const cell = 384;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const texture = gl.createTexture();

  if (!context || !texture) {
    throw new Error("Unable to create photo atlas");
  }

  canvas.width = atlasSize * cell;
  canvas.height = atlasSize * cell;
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  await Promise.all(photos.map((photo, index) => new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => {
      const x = (index % atlasSize) * cell;
      const y = Math.floor(index / atlasSize) * cell;
      const scale = Math.min(cell / image.naturalWidth, cell / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;

      context.fillStyle = "#000000";
      context.fillRect(x, y, cell, cell);
      context.drawImage(image, x + (cell - width) * 0.5, y + (cell - height) * 0.5, width, height);
      resolve();
    };
    image.onerror = () => resolve();
    image.src = photo.src;
  })));

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

  return { texture, atlasSize };
}

export function InfiniteSphere({ photos }: InfiniteSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: true });

    if (!canvas || !gl || photos.length === 0) {
      return undefined;
    }

    let disposed = false;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const orientation = quat.create();
    const velocity = { x: 0.0012, y: 0.002 };
    const projection = mat4.create();
    const sourceCenters = createSphereCenters(Math.max(42, photos.length * 4));
    const centers = new Float32Array(sourceCenters.length);
    const photoIndices = new Float32Array(sourceCenters.length / 3);
    const quad = new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0,
    ]);

    for (let index = 0; index < photoIndices.length; index += 1) {
      photoIndices[index] = index % photos.length;
    }

    const program = createProgram(gl);
    const vao = gl.createVertexArray();
    const quadBuffer = gl.createBuffer();
    const centerBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    const transformed = vec3.create();

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(2, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, photoIndices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(3, 1);
    gl.bindVertexArray(null);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      mat4.perspective(projection, Math.PI / 4, width / height, 0.1, 20);
    };
    const onPointerDown = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer) {
        return;
      }

      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;

      pointer = { x: event.clientX, y: event.clientY };
      velocity.y = dx * 0.003;
      velocity.x = dy * 0.003;
      quat.rotateY(orientation, orientation, velocity.y);
      quat.rotateX(orientation, orientation, velocity.x);
    };
    const onPointerUp = (event: PointerEvent) => {
      pointer = null;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };
    const render = () => {
      if (disposed) {
        return;
      }

      if (!pointer) {
        quat.rotateY(orientation, orientation, velocity.y);
        quat.rotateX(orientation, orientation, velocity.x);
        velocity.x *= 0.96;
        velocity.y = velocity.y * 0.98 + 0.00002;
      }

      let nearestZ = -Infinity;
      let nearest = 0;

      for (let index = 0; index < sourceCenters.length / 3; index += 1) {
        const offset = index * 3;

        vec3.set(transformed, sourceCenters[offset], sourceCenters[offset + 1], sourceCenters[offset + 2]);
        vec3.transformQuat(transformed, transformed, orientation);
        centers[offset] = transformed[0];
        centers[offset + 1] = transformed[1];
        centers[offset + 2] = transformed[2];

        if (transformed[2] > nearestZ) {
          nearestZ = transformed[2];
          nearest = photoIndices[index];
        }
      }

      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, centers);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection);
      gl.uniform1i(gl.getUniformLocation(program, "uAtlas"), 0);
      gl.bindVertexArray(vao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, photoIndices.length);
      gl.bindVertexArray(null);
      frame = window.requestAnimationFrame(render);
    };

    void createAtlas(gl, photos).then(({ texture, atlasSize }) => {
      if (disposed) {
        gl.deleteTexture(texture);
        return;
      }

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.useProgram(program);
      gl.uniform1i(gl.getUniformLocation(program, "uAtlasSize"), atlasSize);
      resize();
      render();
    });

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(centerBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [photos]);

  return (
    <div className="relative h-[72vh] min-h-[28rem] bg-void">
      <canvas ref={canvasRef} className="h-full w-full cursor-grab touch-none active:cursor-grabbing" aria-label="Photo sphere" />
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 border border-faint bg-void/80 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-bone">
        {kindLabel[photos[activeIndex]?.kind ?? "profile"]}
      </p>
    </div>
  );
}
