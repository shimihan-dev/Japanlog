import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/data-go': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/data-go/, ''),
      },
      '/api/hanabank': {
        target: 'https://quotation-api-cdn.dunamu.com/v1/forex/recent',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hanabank/, ''),
      },
    },
  },
})
