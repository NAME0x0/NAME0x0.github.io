import type { Config } from "tailwindcss";

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
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        void: "#000000",
        ink: {
          DEFAULT: "#E8E4DE",
          dim: "#8A8578",
          faint: "#3A3832",
        },
        dim: "#8A8578",
        faint: "#3A3832",
        bone: "#C4B5A0",
        ember: "#D08C5A",
        signal: "#E3B341",
        paper: "#F2EDE4",
        soot: "#1C1A17",
        accent: {
          DEFAULT: "#C4B5A0",
        },
        glass: {
          stroke: "rgba(232, 228, 222, 0.08)",
          fill: "rgba(232, 228, 222, 0.03)",
        },
        semantic: {
          error: "#b94a48",
          info: "#7c9eb2",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
        sm: ["0.875rem", { lineHeight: "1.55", letterSpacing: "0" }],
        base: ["1rem", { lineHeight: "1.7", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        xl: ["1.25rem", { lineHeight: "1.45", letterSpacing: "0" }],
        "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "0" }],
        "3xl": ["2rem", { lineHeight: "1.2", letterSpacing: "0" }],
        "4xl": ["2.75rem", { lineHeight: "1.1", letterSpacing: "0" }],
        display: ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "0" }],
      },
      spacing: {
        "section-y": "clamp(5rem, 9vw, 9rem)",
        "section-gap": "clamp(1.5rem, 4vw, 4rem)",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(232, 228, 222, 0.05)",
        glow: "0 0 20px rgba(232, 228, 222, 0.1)",
        "glow-hover": "0 0 30px rgba(196, 181, 160, 0.15)",
      },
      keyframes: {
        "dot-breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.5)", opacity: "0.8" },
        },
      },
      animation: {
        "dot-breathe": "dot-breathe 3s ease-in-out infinite",
      },
      borderRadius: {
        glass: "0",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        entrance: "cubic-bezier(0.0, 0.0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0.0, 1, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
