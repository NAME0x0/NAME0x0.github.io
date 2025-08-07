import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/', // GitHub Pages root path
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2017',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
          'chart': ['chart.js/auto'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})