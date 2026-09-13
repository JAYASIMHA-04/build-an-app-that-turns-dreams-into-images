import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Dedicated build that inlines every JS/CSS asset into a single index.html
// so the preview renders standalone with zero external asset requests.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-preview',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
  },
})
