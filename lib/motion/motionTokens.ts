/**
 * DOM animation vocabulary — single source of truth for all GSAP
 * ScrollTrigger durations, eases, staggers, and trigger points.
 */

export const MOTION = {
  trigger: {
    standard: "top 78%",
    lazy: "top 82%",
  },
  duration: {
    fast: 0.35,
    normal: 0.7,
    slow: 1.0,
    crawl: 1.5,
  },
  ease: {
    reveal: "power2.out",
    exit: "power2.in",
    indicator: "power3.out",
  },
  stagger: {
    chars: 0.06,
    layers: 0.15,
    cards: 0.1,
    bars: 0.1,
    links: 0.1,
    stats: 0.2,
    lines: 0.08,
    filterCards: 0.06,
    filterExit: 0.04,
  },
  translate: {
    sm: 12,
    md: 15,
    lg: 25,
    card: 30,
  },
} as const;
