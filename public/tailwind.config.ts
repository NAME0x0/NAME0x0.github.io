import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Core Brand Palette
        obsidian: {
          DEFAULT: "#0a0a0a",
          50: "#1a1a1a",
          100: "#0f0f0f",
          900: "#050505",
        },
        gunmetal: {
          DEFAULT: "#1f1f1f",
          50: "#3a3a3a",
          100: "#2a2a2a",
          200: "#252525",
          900: "#141414",
        },
        electric: {
          DEFAULT: "#0ff0fc",
          50: "#e6fdfe",
          100: "#ccfbfd",
          200: "#99f7fb",
          300: "#66f3f9",
          400: "#33eff7",
          500: "#0ff0fc",
          600: "#0ccdda",
          700: "#09aab8",
          800: "#068796",
          900: "#036474",
        },
        silver: {
          DEFAULT: "#bfbfbf",
          50: "#f5f5f5",
          100: "#ebebeb",
          200: "#d6d6d6",
          300: "#c2c2c2",
          400: "#adadad",
          500: "#bfbfbf",
          600: "#999999",
          700: "#737373",
          800: "#4d4d4d",
          900: "#262626",
        },
        // Accent Colors
        neonCyan: {
          DEFAULT: "#00ffff",
          50: "#e6ffff",
          500: "#00ffff",
          600: "#00e6e6",
          700: "#00cccc",
        },
        neonMagenta: {
          DEFAULT: "#ff00ff",
          50: "#ffe6ff",
          500: "#ff00ff",
          600: "#e600e6",
          700: "#cc00cc",
        },
        // Semantic Colors
        success: "#00ff88",
        warning: "#ffaa00",
        error: "#ff3366",
        info: "#0ff0fc",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        // Fluid Typography Scale
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.16" }],
        "6xl": ["3.75rem", { lineHeight: "1.2" }],
        "7xl": ["4.5rem", { lineHeight: "1.1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      spacing: {
        // Extended spacing scale
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        // Enhanced shadow system
        glass: "0 8px 32px 0 rgba(15, 240, 252, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-lg": "0 25px 50px -12px rgba(15, 240, 252, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        holo: "0 0 20px rgba(15, 240, 252, 0.3), 0 0 40px rgba(15, 240, 252, 0.1)",
        "holo-lg": "0 0 30px rgba(15, 240, 252, 0.4), 0 0 60px rgba(15, 240, 252, 0.15)",
        glow: "0 0 30px rgba(15, 240, 252, 0.4)",
        "glow-lg": "0 0 50px rgba(15, 240, 252, 0.5)",
        "inner-glow": "inset 0 0 20px rgba(15, 240, 252, 0.2)",
        neon: "0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc",
        "neon-lg": "0 0 10px #0ff0fc, 0 0 20px #0ff0fc, 0 0 30px #0ff0fc",
      },
      backgroundImage: {
        // Enhanced gradient system
        "holo-radial": "radial-gradient(circle at center, rgba(15, 240, 252, 0.2) 0%, transparent 70%)",
        "grid-pattern": "linear-gradient(rgba(15,240,252,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,240,252,0.1) 1px, transparent 1px)",
        "grid-faint": "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        "noise": "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"1\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        "electric-gradient": "linear-gradient(135deg, #0ff0fc 0%, #00cccc 100%)",
        "obsidian-gradient": "linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)",
        "holographic": "linear-gradient(45deg, transparent 25%, rgba(15,240,252,0.1) 25%, rgba(15,240,252,0.1) 50%, transparent 50%, transparent 75%, rgba(15,240,252,0.1) 75%)",
      },
      backgroundSize: {
        grid: "40px 40px",
        "grid-sm": "20px 20px",
        "grid-lg": "60px 60px",
      },
      animation: {
        // Enhanced animation system
        "fade-in": "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in-delay": "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up-delay": "slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards",
        "slide-down": "slideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-left": "slideLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-right": "slideRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "holo-pulse": "holoPulse 3s ease-in-out infinite",
        "holo-scan": "holoScan 4s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shine": "shine 3s linear infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        "matrix": "matrix 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        holoPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        holoScan: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(15, 240, 252, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(15, 240, 252, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#0ff0fc" },
        },
        matrix: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        "smooth-in": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "smooth-out": "cubic-bezier(0.165, 0.84, 0.44, 1)",
        electric: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "40px",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents, theme }: { addUtilities: any; addComponents: any; theme: any }) {
      // Glass Morphism Utilities
      const glassUtilities = {
        ".glass": {
          backgroundColor: "rgba(31,31,31,0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(191,191,191,0.12)",
          boxShadow: theme("boxShadow.glass"),
        },
        ".glass-strong": {
          backgroundColor: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(15,240,252,0.25)",
          boxShadow: theme("boxShadow.holo"),
        },
        ".glass-subtle": {
          backgroundColor: "rgba(31,31,31,0.4)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(191,191,191,0.08)",
        },
      };

      // Holographic Effects
      const holoUtilities = {
        ".holo-overlay": {
          pointerEvents: "none",
          background: theme("backgroundImage.holo-radial"),
          mixBlendMode: "overlay",
        },
        ".holo-border": {
          border: "1px solid transparent",
          backgroundImage: "linear-gradient(45deg, transparent, rgba(15,240,252,0.3), transparent)",
          backgroundClip: "border-box",
        },
        ".holo-text": {
          background: "linear-gradient(45deg, #0ff0fc, #00cccc, #0ff0fc)",
          backgroundSize: "200% 200%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "holoScan 3s ease-in-out infinite",
        },
      };

      // Animation State Utilities
      const animationUtilities = {
        ".animate-on-scroll": {
          opacity: "0",
          transform: "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        },
        ".animate-on-scroll.in-view": {
          opacity: "1",
          transform: "translateY(0)",
        },
        ".gpu-accelerated": {
          transform: "translateZ(0)",
          willChange: "transform",
        },
      };

      addUtilities({
        ...glassUtilities,
        ...holoUtilities,
        ...animationUtilities,
      });

      // Component-level styles
      const components = {
        ".surface": {
          "@apply glass rounded-xl border border-silver/10 shadow-glass": {},
        },
        ".surface-strong": {
          "@apply glass-strong rounded-xl border border-electric/20 shadow-holo": {},
        },
        ".frame": {
          "@apply rounded-xl border border-silver/10 bg-gunmetal/60 backdrop-blur-md": {},
        },
        ".frame-strong": {
          "@apply rounded-xl border border-electric/20 bg-gunmetal/80 backdrop-blur-lg shadow-holo": {},
        },
        ".cta": {
          "@apply inline-flex items-center justify-center rounded-full bg-electric text-obsidian px-6 py-3 font-heading font-medium shadow-glow hover:shadow-holo transition-all duration-300 ease-smooth": {},
        },
        ".cta-outline": {
          "@apply inline-flex items-center justify-center rounded-full border-2 border-electric text-electric px-6 py-3 font-heading font-medium hover:bg-electric hover:text-obsidian transition-all duration-300 ease-smooth": {},
        },
        ".cta-ghost": {
          "@apply inline-flex items-center justify-center rounded-full text-electric px-6 py-3 font-heading font-medium hover:bg-electric/10 transition-all duration-300 ease-smooth": {},
        },
        ".input-field": {
          "@apply w-full px-4 py-3 bg-obsidian/60 border border-silver/20 rounded-lg text-silver placeholder:text-silver/40 focus:border-electric/60 focus:outline-none focus:ring-2 focus:ring-electric/20 transition-colors": {},
        },
        ".heading-primary": {
          "@apply font-heading text-4xl md:text-6xl lg:text-7xl text-silver font-bold tracking-tight": {},
        },
        ".heading-secondary": {
          "@apply font-heading text-3xl md:text-4xl lg:text-5xl text-silver font-semibold tracking-tight": {},
        },
        ".heading-tertiary": {
          "@apply font-heading text-xl md:text-2xl lg:text-3xl text-electric font-medium": {},
        },
        ".body-large": {
          "@apply font-body text-lg md:text-xl text-silver/90 leading-relaxed": {},
        },
        ".body-medium": {
          "@apply font-body text-base md:text-lg text-silver/80 leading-relaxed": {},
        },
        ".body-small": {
          "@apply font-body text-sm md:text-base text-silver/70": {},
        },
        ".code": {
          "@apply font-mono text-sm bg-gunmetal/40 px-2 py-1 rounded border border-silver/20 text-electric": {},
        },
      };

      addComponents(components);
    },
  ],
} satisfies Config;