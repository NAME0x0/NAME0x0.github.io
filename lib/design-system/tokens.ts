/**
 * Systems-minimal cinematic design tokens for the Sovereign Void aesthetic.
 * Semantic primitives are the source of truth for the black and off-white design.
 */

export const colors = {
  void: "#000000",
  ink: {
    DEFAULT: "#E8E4DE",
    dim: "#9B9589",
    faint: "#3A3832",
  },
  accent: {
    DEFAULT: "#C4B5A0",
  },
  glass: {
    stroke: "rgba(232, 228, 222, 0.08)",
    fill: "rgba(232, 228, 222, 0.03)",
    blur: "12px",
  },
  semantic: {
    error: "#b94a48",
    info: "#7c9eb2",
  },
} as const;

export const typography = {
  fontFamily: {
    display: ["var(--font-heading)", "system-ui", "sans-serif"],
    heading: ["var(--font-heading)", "system-ui", "sans-serif"],
    body: ["var(--font-body)", "system-ui", "sans-serif"],
    mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
  },
  fontSize: {
    xs: ["clamp(11px, 0.09vw + 10.6px, 12px)", { lineHeight: "1.5", letterSpacing: "0.04em" }],
    sm: ["clamp(13px, 0.19vw + 12.2px, 14px)", { lineHeight: "1.5", letterSpacing: "0.02em" }],
    base: ["clamp(15px, 0.19vw + 14.2px, 16px)", { lineHeight: "1.65", letterSpacing: "0em" }],
    lg: ["clamp(17px, 0.38vw + 15.5px, 20px)", { lineHeight: "1.55", letterSpacing: "-0.01em" }],
    xl: ["clamp(19px, 0.57vw + 16.7px, 24px)", { lineHeight: "1.45", letterSpacing: "-0.02em" }],
    "2xl": ["clamp(21px, 0.76vw + 18px, 28px)", { lineHeight: "1.35", letterSpacing: "-0.02em" }],
    "3xl": ["clamp(25px, 1.14vw + 20.4px, 36px)", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
    "4xl": ["clamp(32px, 1.9vw + 24.4px, 52px)", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
    display: ["clamp(48px, 2.28vw + 39.1px, 72px)", { lineHeight: "1.05", letterSpacing: "-0.05em" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const spacing = {
  "2xs": "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "5rem",
  "5xl": "6rem",
  "6xl": "8rem",
  "section-y": "clamp(80px, 7.61vw + 50.3px, 180px)",
  "section-gap": "clamp(24px, 2.28vw + 15.1px, 48px)",
} as const;

export const shadows = {
  none: "none",
  glass: "0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(232, 228, 222, 0.05)",
  glow: "0 0 20px rgba(232, 228, 222, 0.1)",
  "glow-hover": "0 0 30px rgba(196, 181, 160, 0.15)",
} as const;

export const animations = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
    entrance: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
  },
  keyframes: {
    "dot-breathe": {
      "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
      "50%": { transform: "scale(1.5)", opacity: "0.8" },
    },
    "hand-reach": {
      "0%": { transform: "translateX(-20px) rotate(-2deg)" },
      "100%": { transform: "translateX(0) rotate(0deg)" },
    },
    "count-up": {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "bar-fill": {
      "0%": { transform: "scaleX(0)" },
      "100%": { transform: "scaleX(1)" },
    },
  },
} as const;

export const components = {
  card: {
    background: colors.glass.fill,
    backdropFilter: `blur(${colors.glass.blur})`,
    border: `1px solid ${colors.glass.stroke}`,
    borderRadius: "0",
    shadow: shadows.glass,
    hoverShadow: shadows["glow-hover"],
  },
  button: {
    background: "transparent",
    color: colors.ink.DEFAULT,
    border: "none",
    minHeight: "44px",
    padding: `${spacing.sm} ${spacing.lg}`,
    letterSpacing: "0.1em",
    hoverColor: colors.accent.DEFAULT,
  },
  nav: {
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: `blur(${colors.glass.blur})`,
    height: "64px",
    horizontalPadding: "clamp(24px, 1.14vw + 19.4px, 32px)",
    itemMinHeight: "44px",
    itemTracking: "0.1em",
    color: colors.ink.dim,
    activeColor: colors.ink.DEFAULT,
  },
  tab: {
    background: "transparent",
    color: colors.ink.dim,
    activeColor: colors.ink.DEFAULT,
    padding: `${spacing.xs} ${spacing.md}`,
  },
} as const;

export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,
  animations,
  components,
} as const;

export default designTokens;
