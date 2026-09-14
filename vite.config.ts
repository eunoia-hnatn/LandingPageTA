import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@user': path.resolve(import.meta.dirname, './src/features/user'),
      '@admin': path.resolve(import.meta.dirname, './src/features/admin'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
    },
  },
  server: {
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
})
