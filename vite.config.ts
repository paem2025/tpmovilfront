/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
