import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  optimizeDeps: {
    exclude: ['supabase/functions'],
  },
  build: {
    rollupOptions: {
      external: [/^https:/],
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/supabase/functions/**'],
    },
    cors: true,
    allowedHosts: true,
  },
})
