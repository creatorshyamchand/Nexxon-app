import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  base: './',
  optimizeDeps: {
    exclude: ['supabase/functions'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      external: [/^https:/],
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/supabase/functions/**'],
    },
    port: 3000,
    open: true,
    cors: true,
    allowedHosts: true,
  },
  preview: {
    port: 4173,
    open: true
  }
})
