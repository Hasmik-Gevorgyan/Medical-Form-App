import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: process.env.NODE_ENV === 'production'
        ? undefined
        : {
          '/verifyCertificate': {
            target: 'https://us-central1-medical-project-2ba5d.cloudfunctions.net',
            changeOrigin: true,
            secure: true,
          },
        },
  }
})
