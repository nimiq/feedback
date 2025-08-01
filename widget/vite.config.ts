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
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'scope-widget-css',
          Rule(rule) {
            // Skip rules that are already scoped or are keyframes
            if (rule.selector.includes('#feedback-widget')
              || rule.selector.includes('@keyframes')
              || rule.selector.includes('@media')
              || rule.selector.startsWith('@')) {
              return
            }

            // Replace :root with #feedback-widget
            if (rule.selector === ':root') {
              rule.selector = '#feedback-widget'
              return
            }

            // Scope all other selectors
            const selectors = rule.selector.split(',').map(s => s.trim())
            rule.selector = selectors.map((selector) => {
              // Skip if already scoped
              if (selector.includes('#feedback-widget'))
                return selector

              // Handle pseudo-selectors like :host
              if (selector.startsWith(':host')) {
                return selector.replace(':host', '#feedback-widget')
              }

              // Scope regular selectors
              return `#feedback-widget ${selector}`
            }).join(', ')
          },
        },
      ],
    },
  },
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
