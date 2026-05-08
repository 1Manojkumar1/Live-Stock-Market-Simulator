import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/user-api': 'http://localhost:5000',
      '/admin-api': 'http://localhost:5000',
      '/stock-api': 'http://localhost:5000',
      '/trans': 'http://localhost:5000',
    }
  }
})
