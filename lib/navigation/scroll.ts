/**
 * Shared smooth-scroll utility for programmatic section navigation.
 * Respects prefers-reduced-motion.
 */

export function smoothScrollTo(sectionId: string): void {
  if (typeof window === "undefined") return;

  const target = document.getElementById(sectionId);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  if (window.location.hash !== `#${sectionId}`) {
    window.history.replaceState(null, "", `#${sectionId}`);
  }
}
