import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import Uno from 'unocss/vite'
import { defineConfig } from 'vite'

const root = resolve(join(fileURLToPath(import.meta.url), '../..'))
const outDir = resolve(root, 'backend/public')
const sharedBackendDir = join(root, 'backend/shared')
const widgetFolder = join(root, 'widget')
const playgroundFolder = join(root, 'playground')
const entry = join(widgetFolder, 'src/widget-entry.ts')

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'preventAssignment': true,
    }),
    Uno({ configFile: '../uno.config.ts' }),

  ],
  // Use our custom TypeScript config for widget
  root: __dirname,
  // Specify the TypeScript config file to use
  optimizeDeps: {
    // This helps with imports resolution
    entries: ['src/widget-entry.ts'],
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry,
      name: 'FeedbackWidget',
      formats: ['umd'] as const,
      fileName: () => 'widget.js',
    },
    outDir,
    rollupOptions: {},
    watch: {
      include: [`${widgetFolder}/**/*`, `${playgroundFolder}/**/*`],
    },
  },

  resolve: {
    alias: {
      '#backend': sharedBackendDir,
    },
  },
})
