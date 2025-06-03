import type { Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
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
const entry = join(widgetFolder, 'src/widget-entry.ts')
const outputFolder = join(root, 'backend/public')

export default defineConfig({
  publicDir: false,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // This forces *every* SFC to use as its scope ID
          scopeId: 'v-nq-feedback',
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'preventAssignment': true,
    }),
    Uno({ configFile: '../uno.config.ts' }),
    cssWrapperPlugin(),
  ],
  root: __dirname, // Directs Vite to use the 'widget' folder as the project root
  optimizeDeps: {
    entries: ['src/widget-entry.ts'],
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry,
      name: 'FeedbackWidget',
      formats: ['umd'],
      fileName: () => 'widget.js',
    },

    outDir: outputFolder,
  },
  resolve: {
    alias: {
      '#backend': sharedBackendDir,
    },
  },
})

// Custom plugin to wrap CSS with selector. This is a trick to increase the selector specificity
// and avoid conflicts with other styles on the page.
function cssWrapperPlugin() {
  return {
    name: 'css-wrapper',
    writeBundle() {
      // Read the widget.css and wrap it
      const filePath = join(outputFolder, 'widget.css')
      console.log(`Wrapping CSS file: ${filePath}`)
      const content = readFileSync(filePath)
      const wrappedContent = `#feedback-widget{${content}}`
      writeFileSync(filePath, wrappedContent)
    },
  } satisfies Plugin
}
