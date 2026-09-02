import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'react'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('lucide')) return 'icons'
            if (id.includes('date-fns') || id.includes('dayjs')) return 'datetime'
            return 'vendor'
          }
          // Split admin pages into separate chunk
          if (id.includes('/pages/Admin/')) return 'admin'
          // Split auth-related pages
          if (id.includes('/pages/Login') || id.includes('/pages/Profile') || id.includes('/pages/Settings')) return 'auth'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash].' + ext
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash].' + ext
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash].' + ext
          }
          return 'assets/[name]-[hash].' + ext
        },
      },
    },
  },
})
