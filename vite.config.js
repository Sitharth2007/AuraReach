import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/n8n': {
        target: 'https://sitharth07.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      },
    },
  },
})