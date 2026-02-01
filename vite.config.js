import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'edusync.centralindia.cloudapp.azure.com'
    ],
    port: 3000,
    open: '/home/index.html',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/dashboard': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/login': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
})
