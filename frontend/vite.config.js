import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:5000',
      '/user-api': 'http://127.0.0.1:5000',
      '/admin-api': 'http://127.0.0.1:5000',
      '/stock-api': 'http://127.0.0.1:5000',
      '/trans': 'http://127.0.0.1:5000',
    }

  }
})
