import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2017'
  },
  server: {
    allowedHosts: ['.monkeycode-ai.live'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/audio': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/logo': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    allowedHosts: ['.monkeycode-ai.live'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/audio': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/logo': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
