import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    server: {
      host: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
      },
      "/socket.io": {
        target: "http://localhost:8000",
        ws:true,
        changeOrigin: true
      }
    },
  }
})
