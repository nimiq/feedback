import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import Uno from 'unocss/vite'
import { defineConfig } from 'vite'

const root = resolve(join(fileURLToPath(import.meta.url), '../..'))
const sharedBackendDir = join(root, 'backend/shared')
const widgetFolder = join(root, 'widget')
const playgroundFolder = join(root, 'playground') // Kept for watch, though not strictly necessary for build output
const entry = join(widgetFolder, 'src/widget-entry.ts')

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    replace({ // MODIFIED: Removed __APP_NAME__ and __LANG_CODE__
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'preventAssignment': true,
    }),
    Uno({ configFile: '../uno.config.ts' }),
  ],
  root: __dirname, // Directs Vite to use the 'widget' folder as the project root
  optimizeDeps: {
    entries: ['src/widget-entry.ts'],
  },
  build: {
    emptyOutDir: false, // Kept as per example, might need review based on actual deployment
    lib: {
      entry,
      name: 'FeedbackWidget',
      formats: ['umd'] as const,
      fileName: () => 'widget.js', // Ensured this is correct
    },
    outDir: resolve(root, 'backend/public'), // MODIFIED: Reverted to single output directory
    rollupOptions: {},
    watch: { // Kept watch configuration as it was not mentioned to be removed
      include: [`${widgetFolder}/**/*`, `${playgroundFolder}/**/*`],
    },
  },
  resolve: {
    alias: {
      '#backend': sharedBackendDir,
    },
  },
})
