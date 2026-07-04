type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

// Software/reference rasterizers that would render the scenes at slideshow
// speed. Everything else with a real WebGL2 context is allowed: the widget
// scenes are a few hundred additively-blended points on small canvases —
// well within reach of any hardware GPU, mobile included.
//
// (A previous version scored GPUs against a local detect-gpu benchmark table
// of consumer model names. Workstation parts like the owner's RTX A2000
// matched nothing, scored tier 1, and were silently refused — a false
// negative on exactly the hardware this site celebrates. Default-allow with
// a software-renderer blocklist cannot fail that way.)
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i;

export async function checkFilmGate(): Promise<boolean> {
  if (new URLSearchParams(window.location.search).get("film") === "force") {
    return true;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

  if (prefersReducedMotion || saveData) {
    return false;
  }

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", { powerPreference: "high-performance" });

  if (!gl) {
    return false;
  }

  let renderer = "";
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  if (debugInfo) {
    renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "");
  }

  gl.getExtension("WEBGL_lose_context")?.loseContext();

  return !SOFTWARE_RENDERER.test(renderer);
}
