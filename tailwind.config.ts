import type { Config } from "tailwindcss";
import { animations, colors, shadows, spacing, typography } from "./lib/design-system/tokens";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      ...require("tailwindcss/defaultTheme").screens,
      "2xl": "1440px",
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        void: colors.void,
        ink: {
          DEFAULT: colors.ink.DEFAULT,
          dim: colors.ink.dim,
          faint: colors.ink.faint,
        },
        accent: {
          DEFAULT: colors.accent.DEFAULT,
        },
        glass: {
          stroke: colors.glass.stroke,
          fill: colors.glass.fill,
        },
        semantic: {
          error: colors.semantic.error,
          info: colors.semantic.info,
        },
      },
      fontFamily: {
        heading: [...typography.fontFamily.heading],
        body: [...typography.fontFamily.body],
        mono: [...typography.fontFamily.mono],
      },
      fontSize: {
        xs: [typography.fontSize.xs[0], { ...typography.fontSize.xs[1] }],
        sm: [typography.fontSize.sm[0], { ...typography.fontSize.sm[1] }],
        base: [typography.fontSize.base[0], { ...typography.fontSize.base[1] }],
        lg: [typography.fontSize.lg[0], { ...typography.fontSize.lg[1] }],
        xl: [typography.fontSize.xl[0], { ...typography.fontSize.xl[1] }],
        "2xl": [typography.fontSize["2xl"][0], { ...typography.fontSize["2xl"][1] }],
        "3xl": [typography.fontSize["3xl"][0], { ...typography.fontSize["3xl"][1] }],
        "4xl": [typography.fontSize["4xl"][0], { ...typography.fontSize["4xl"][1] }],
        display: [typography.fontSize.display[0], { ...typography.fontSize.display[1] }],
      },
      spacing: {
        "section-y": spacing["section-y"],
        "section-gap": spacing["section-gap"],
      },
      boxShadow: {
        glass: shadows.glass,
        glow: shadows.glow,
        "glow-hover": shadows["glow-hover"],
      },
      keyframes: {
        "dot-breathe": animations.keyframes["dot-breathe"],
        "hand-reach": animations.keyframes["hand-reach"],
        "count-up": animations.keyframes["count-up"],
        "bar-fill": animations.keyframes["bar-fill"],
      },
      animation: {
        "dot-breathe": "dot-breathe 3s ease-in-out infinite",
        "hand-reach": `hand-reach ${animations.duration.slow} ${animations.easing.smooth} both`,
        "count-up": `count-up ${animations.duration.normal} ${animations.easing.entrance} both`,
        "bar-fill": `bar-fill 1.2s ${animations.easing.smooth} forwards`,
      },
      borderRadius: {
        glass: "0.5rem",
      },
      transitionTimingFunction: {
        smooth: animations.easing.smooth,
        entrance: animations.easing.entrance,
        exit: animations.easing.exit,
      },
    },
  },
  plugins: [],
};

export default config;
