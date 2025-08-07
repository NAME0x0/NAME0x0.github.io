import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/', // Custom domain uses root path
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for GitHub Pages
    target: 'es2017',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'app.js', // Keep consistent filename
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000, // Increased due to Three.js bundle size
  },
  plugins: [
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})