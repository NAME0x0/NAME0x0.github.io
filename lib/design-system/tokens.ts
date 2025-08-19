/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the application
 */

// Color Palette
export const colors = {
  // Primary Brand Colors
  obsidian: {
    DEFAULT: '#0a0a0a',
    50: '#1a1a1a',
    100: '#0f0f0f',
    900: '#050505',
  },
  gunmetal: {
    DEFAULT: '#1f1f1f',
    50: '#3a3a3a',
    100: '#2a2a2a',
    200: '#252525',
    900: '#141414',
  },
  electric: {
    DEFAULT: '#0ff0fc',
    50: '#e6fdfe',
    100: '#ccfbfd',
    200: '#99f7fb',
    300: '#66f3f9',
    400: '#33eff7',
    500: '#0ff0fc',
    600: '#0ccdda',
    700: '#09aab8',
    800: '#068796',
    900: '#036474',
  },
  silver: {
    DEFAULT: '#bfbfbf',
    50: '#f5f5f5',
    100: '#ebebeb',
    200: '#d6d6d6',
    300: '#c2c2c2',
    400: '#adadad',
    500: '#bfbfbf',
    600: '#999999',
    700: '#737373',
    800: '#4d4d4d',
    900: '#262626',
  },
  // Accent Colors
  neonCyan: {
    DEFAULT: '#00ffff',
    50: '#e6ffff',
    500: '#00ffff',
    600: '#00e6e6',
    700: '#00cccc',
  },
  neonMagenta: {
    DEFAULT: '#ff00ff',
    50: '#ffe6ff',
    500: '#ff00ff',
    600: '#e600e6',
    700: '#cc00cc',
  },
  // Semantic Colors
  semantic: {
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff3366',
    info: '#0ff0fc',
  },
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    heading: ['var(--font-space-grotesk)', 'Inter', 'system-ui', 'sans-serif'],
    body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.16' }],
    '6xl': ['3.75rem', { lineHeight: '1.2' }],
    '7xl': ['4.5rem', { lineHeight: '1.1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Spacing Scale
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '5rem',    // 80px
  '5xl': '6rem',    // 96px
  '6xl': '8rem',    // 128px
} as const;

// Border Radius Scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
  '5xl': '2.5rem',  // 40px
  full: '9999px',
} as const;

// Shadow System
export const shadows = {
  glass: '0 8px 32px 0 rgba(15, 240, 252, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  'glass-lg': '0 25px 50px -12px rgba(15, 240, 252, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  holo: '0 0 20px rgba(15, 240, 252, 0.3), 0 0 40px rgba(15, 240, 252, 0.1)',
  'holo-lg': '0 0 30px rgba(15, 240, 252, 0.4), 0 0 60px rgba(15, 240, 252, 0.15)',
  glow: '0 0 30px rgba(15, 240, 252, 0.4)',
  'glow-lg': '0 0 50px rgba(15, 240, 252, 0.5)',
  'inner-glow': 'inset 0 0 20px rgba(15, 240, 252, 0.2)',
  neon: '0 0 5px #0ff0fc, 0 0 10px #0ff0fc, 0 0 15px #0ff0fc',
  'neon-lg': '0 0 10px #0ff0fc, 0 0 20px #0ff0fc, 0 0 30px #0ff0fc',
} as const;

// Animation System
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
    slowest: '1200ms',
  },
  easing: {
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    electric: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'smooth-in': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'smooth-out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideUp: {
      '0%': { opacity: '0', transform: 'translateY(40px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideDown: {
      '0%': { opacity: '0', transform: 'translateY(-40px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideLeft: {
      '0%': { opacity: '0', transform: 'translateX(40px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' },
    },
    slideRight: {
      '0%': { opacity: '0', transform: 'translateX(-40px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' },
    },
    scaleIn: {
      '0%': { opacity: '0', transform: 'scale(0.9)' },
      '100%': { opacity: '1', transform: 'scale(1)' },
    },
    holoPulse: {
      '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
      '50%': { opacity: '0.8', transform: 'scale(1.02)' },
    },
    glowPulse: {
      '0%, 100%': { boxShadow: '0 0 20px rgba(15, 240, 252, 0.3)' },
      '50%': { boxShadow: '0 0 40px rgba(15, 240, 252, 0.6)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    shine: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
  },
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

// Z-Index Scale
export const zIndex = {
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Glass Morphism Properties
export const glass = {
  background: 'rgba(31, 31, 31, 0.6)',
  'background-strong': 'rgba(10, 10, 10, 0.8)',
  'background-subtle': 'rgba(31, 31, 31, 0.4)',
  blur: '12px',
  'blur-strong': '20px',
  'blur-subtle': '8px',
  border: 'rgba(191, 191, 191, 0.12)',
  'border-strong': 'rgba(15, 240, 252, 0.25)',
  'border-subtle': 'rgba(191, 191, 191, 0.08)',
} as const;

// Component Variants
export const components = {
  button: {
    primary: {
      background: colors.electric.DEFAULT,
      color: colors.obsidian.DEFAULT,
      shadow: shadows.glow,
      hoverShadow: shadows.holo,
    },
    secondary: {
      background: 'transparent',
      color: colors.electric.DEFAULT,
      border: `2px solid ${colors.electric.DEFAULT}`,
      hoverBackground: colors.electric.DEFAULT,
      hoverColor: colors.obsidian.DEFAULT,
    },
    ghost: {
      background: 'transparent',
      color: colors.electric.DEFAULT,
      hoverBackground: 'rgba(15, 240, 252, 0.1)',
    },
  },
  input: {
    default: {
      background: 'rgba(10, 10, 10, 0.6)',
      border: `1px solid ${colors.silver[200]}`,
      color: colors.silver.DEFAULT,
      placeholder: colors.silver[400],
      focusBorder: colors.electric[600],
      focusRing: 'rgba(15, 240, 252, 0.2)',
    },
  },
  card: {
    default: {
      background: glass.background,
      backdropFilter: `blur(${glass.blur})`,
      border: `1px solid ${glass.border}`,
      borderRadius: borderRadius['xl'],
      shadow: shadows.glass,
    },
    strong: {
      background: glass['background-strong'],
      backdropFilter: `blur(${glass['blur-strong']})`,
      border: `1px solid ${glass['border-strong']}`,
      borderRadius: borderRadius['xl'],
      shadow: shadows.holo,
    },
  },
} as const;

// Motion Presets
export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: animations.easing.smooth },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: animations.easing.smooth },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: animations.easing.smooth },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: animations.easing.smooth },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: animations.easing.smooth },
  },
  holoPulse: {
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 3,
      ease: animations.easing['ease-in-out'],
      repeat: Infinity,
    },
  },
} as const;

// Layout Containers
export const containers = {
  cinematic: {
    maxWidth: '1400px',
    padding: {
      DEFAULT: spacing.md,
      sm: spacing.xl,
      lg: spacing['3xl'],
    },
  },
  content: {
    maxWidth: '1200px',
    padding: {
      DEFAULT: spacing.md,
      sm: spacing.lg,
      lg: spacing.xl,
    },
  },
  narrow: {
    maxWidth: '800px',
    padding: {
      DEFAULT: spacing.md,
      sm: spacing.lg,
    },
  },
} as const;

// Export all tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  glass,
  components,
  motionPresets,
  containers,
} as const;

export default designTokens;