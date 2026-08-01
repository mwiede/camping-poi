import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

// leaflet.locatecontrol 0.90 ships CSS with a broken sourcemap path (dist/dist/...)
// enforce: 'pre' + load hook intercepts before Vite reads the file and tries to resolve the map
const stripBrokenSourcemaps = {
  name: 'strip-broken-sourcemaps',
  enforce: 'pre',
  load(id) {
    if (id.includes('leaflet.locatecontrol') && id.endsWith('.css')) {
      const code = readFileSync(id, 'utf-8')
      return code.replace(/\/\*#\s*sourceMappingURL=.*?\*\//g, '')
    }
  },
}

export default defineConfig({
  base: '/camping-poi/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react(), stripBrokenSourcemaps],
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
