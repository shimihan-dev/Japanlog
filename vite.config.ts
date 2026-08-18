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
      '/api/naver-fx': {
        target: 'https://api.stock.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver-fx/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
      },
      '/api/hanabank': {
        target: 'https://api.stock.naver.com/marketindex/exchange',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hanabank/, ''),
      },
    },
  },
})
