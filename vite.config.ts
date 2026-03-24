import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@tiptap/')) return 'tiptap'
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'export'
          if (id.includes('@radix-ui/')) return 'ui'
        },
      },
    },
  },
})
