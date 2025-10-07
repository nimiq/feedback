import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Uno from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), Uno()],
  resolve: {
    alias: {
      'nimiq-feedback-widget': fileURLToPath(new URL('../widget/src/index.ts', import.meta.url)),
      '#backend': fileURLToPath(new URL('../backend/shared', import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ['!**/widget/src/**', '!**/backend/shared/**'],
    },
  },
})
