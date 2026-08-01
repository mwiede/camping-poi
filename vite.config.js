import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/camping-poi/',
  plugins: [react()],
  server: {
    proxy: {
      '/services': {
        target: 'https://park4night.com',
        changeOrigin: true,
        //configure: (proxy) => {
        //  proxy.on('proxyReq', (proxyReq, req) => {
        //    console.log('→ proxy:', req.url)
        //  })
        //},
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
