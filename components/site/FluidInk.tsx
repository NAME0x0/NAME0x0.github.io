"use client";

/*
 * Minimal stable-fluids cursor ink layer, adapted from Pavel Dobryakov's
 * MIT-licensed WebGL-Fluid-Simulation approach:
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 */

import { useEffect, useRef } from "react";

const SIM_SIZE = 96;
const VELOCITY_DISSIPATION = 0.98;
const DYE_DISSIPATION = 0.965;
const SPLAT_RADIUS = 0.00675;

const vertexShader = `#version 300 es
precision highp float;
out vec2 vUv;
const vec2 positions[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  vUv = positions[gl_VertexID] * 0.5 + 0.5;
  gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}`;

const advectShader = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 velocity = texture(uVelocity, vUv).xy;
  vec2 coord = vUv - uDt * velocity * uTexel;
  fragColor = texture(uSource, coord) * uDissipation;
}`;

const splatShader = `#version 300 es
precision highp float;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspect;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  fragColor = texture(uTarget, vUv) + vec4(splat, 1.0);
}`;

const divergenceShader = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float left = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float bottom = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float top = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  fragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}`;

const pressureShader = `#version 300 es
precision highp float;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float left = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float top = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((left + right + bottom + top - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const gradientShader = `#version 300 es
precision highp float;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float left = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float top = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

const displayShader = `#version 300 es
precision highp float;
uniform sampler2D uDye;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  fragColor = vec4(dye, max(max(dye.r, dye.g), dye.b));
}`;

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
};

type Fbo = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
};

type DoubleFbo = {
  read: Fbo;
  write: Fbo;
  swap: () => void;
};

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) throw new Error("Unable to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext, fragmentSource: string, uniforms: string[]): Program {
  const program = gl.createProgram();

  if (!program) throw new Error("Unable to create program");

  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Program link failed");
  }

  return {
    program,
    uniforms: Object.fromEntries(uniforms.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<string, WebGLUniformLocation>,
  };
}

function createFbo(gl: WebGL2RenderingContext): Fbo {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();

  if (!texture || !framebuffer) throw new Error("Unable to create framebuffer");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, SIM_SIZE, SIM_SIZE, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { texture, framebuffer };
}

function createDoubleFbo(gl: WebGL2RenderingContext): DoubleFbo {
  const fbo = {
    read: createFbo(gl),
    write: createFbo(gl),
    swap() {
      const temp = fbo.read;

      fbo.read = fbo.write;
      fbo.write = temp;
    },
  };

  return fbo;
}

function bindTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, unit: number) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function FluidInk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false });

    if (!canvas || !gl) {
      return undefined;
    }

    gl.getExtension("EXT_color_buffer_float");
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    const texel = [1 / SIM_SIZE, 1 / SIM_SIZE] as const;
    const velocity = createDoubleFbo(gl);
    const dye = createDoubleFbo(gl);
    const pressure = createDoubleFbo(gl);
    const divergence = createFbo(gl);
    const advect = createProgram(gl, advectShader, ["uVelocity", "uSource", "uTexel", "uDt", "uDissipation"]);
    const splat = createProgram(gl, splatShader, ["uTarget", "uPoint", "uColor", "uRadius", "uAspect"]);
    const div = createProgram(gl, divergenceShader, ["uVelocity", "uTexel"]);
    const press = createProgram(gl, pressureShader, ["uPressure", "uDivergence", "uTexel"]);
    const grad = createProgram(gl, gradientShader, ["uPressure", "uVelocity", "uTexel"]);
    const display = createProgram(gl, displayShader, ["uDye"]);
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    let lastInput = 0;
    let splatCount = 0;
    let lastX = 0;
    let lastY = 0;
    let hasPointer = false;
    let running = false;
    let simulateThisFrame = false;

    const blit = (target: WebGLFramebuffer | null, viewportWidth = SIM_SIZE, viewportHeight = SIM_SIZE) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target);
      gl.viewport(0, 0, viewportWidth, viewportHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const runAdvect = (target: DoubleFbo, source: WebGLTexture, dissipation: number, dt: number) => {
      gl.useProgram(advect.program);
      bindTexture(gl, velocity.read.texture, 0);
      bindTexture(gl, source, 1);
      gl.uniform1i(advect.uniforms.uVelocity, 0);
      gl.uniform1i(advect.uniforms.uSource, 1);
      gl.uniform2f(advect.uniforms.uTexel, texel[0], texel[1]);
      gl.uniform1f(advect.uniforms.uDt, dt);
      gl.uniform1f(advect.uniforms.uDissipation, dissipation);
      blit(target.write.framebuffer);
      target.swap();
    };

    const doSplat = (target: DoubleFbo, x: number, y: number, color: readonly [number, number, number]) => {
      gl.useProgram(splat.program);
      bindTexture(gl, target.read.texture, 0);
      gl.uniform1i(splat.uniforms.uTarget, 0);
      gl.uniform2f(splat.uniforms.uPoint, x, y);
      gl.uniform3f(splat.uniforms.uColor, color[0], color[1], color[2]);
      gl.uniform1f(splat.uniforms.uRadius, SPLAT_RADIUS);
      gl.uniform1f(splat.uniforms.uAspect, width / Math.max(height, 1));
      blit(target.write.framebuffer);
      target.swap();
    };

    const step = (time: number) => {
      const dt = Math.min(0.032, (time - lastTime) / 1000);

      lastTime = time;
      runAdvect(velocity, velocity.read.texture, VELOCITY_DISSIPATION, dt);
      runAdvect(dye, dye.read.texture, DYE_DISSIPATION, dt);
      gl.useProgram(div.program);
      bindTexture(gl, velocity.read.texture, 0);
      gl.uniform1i(div.uniforms.uVelocity, 0);
      gl.uniform2f(div.uniforms.uTexel, texel[0], texel[1]);
      blit(divergence.framebuffer);
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.framebuffer);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      pressure.swap();

      for (let index = 0; index < 8; index += 1) {
        gl.useProgram(press.program);
        bindTexture(gl, pressure.read.texture, 0);
        bindTexture(gl, divergence.texture, 1);
        gl.uniform1i(press.uniforms.uPressure, 0);
        gl.uniform1i(press.uniforms.uDivergence, 1);
        gl.uniform2f(press.uniforms.uTexel, texel[0], texel[1]);
        blit(pressure.write.framebuffer);
        pressure.swap();
      }

      gl.useProgram(grad.program);
      bindTexture(gl, pressure.read.texture, 0);
      bindTexture(gl, velocity.read.texture, 1);
      gl.uniform1i(grad.uniforms.uPressure, 0);
      gl.uniform1i(grad.uniforms.uVelocity, 1);
      gl.uniform2f(grad.uniforms.uTexel, texel[0], texel[1]);
      blit(velocity.write.framebuffer);
      velocity.swap();
      gl.useProgram(display.program);
      bindTexture(gl, dye.read.texture, 0);
      gl.uniform1i(display.uniforms.uDye, 0);
      blit(null, width, height);
    };

    const tick = (time: number) => {
      if (document.hidden || time - lastInput > 4000) {
        running = false;
        return;
      }

      simulateThisFrame = !simulateThisFrame;

      if (simulateThisFrame) {
        step(time);
      } else {
        gl.useProgram(display.program);
        bindTexture(gl, dye.read.texture, 0);
        gl.uniform1i(display.uniforms.uDye, 0);
        blit(null, width, height);
      }

      frame = window.requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (running || document.hidden) {
        return;
      }

      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.useProgram(display.program);
      bindTexture(gl, dye.read.texture, 0);
      gl.uniform1i(display.uniforms.uDye, 0);
      blit(null, width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const x = event.clientX / Math.max(window.innerWidth, 1);
      const y = 1 - event.clientY / Math.max(window.innerHeight, 1);
      const dx = hasPointer ? (event.clientX - lastX) * 0.004 : 0;
      const dy = hasPointer ? (lastY - event.clientY) * 0.004 : 0;
      const dyeColor = splatCount % 8 === 0 ? [0.162, 0.102, 0.066] as const : [0.12, 0.114, 0.09] as const;

      hasPointer = true;
      lastX = event.clientX;
      lastY = event.clientY;
      lastInput = performance.now();
      splatCount += 1;
      doSplat(velocity, x, y, [dx, dy, 0]);
      doSplat(dye, x, y, dyeColor);
      ensureLoop();
    };

    const onVisibility = () => {
      if (!document.hidden && performance.now() - lastInput <= 4000) {
        ensureLoop();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1] opacity-[0.18] mix-blend-screen" aria-hidden="true" />;
}
