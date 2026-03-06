import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const widgetRoot = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(widgetRoot, '..')
const entry = resolve(widgetRoot, 'src/widget-entry.ts')
const outputFolder = resolve(workspaceRoot, 'backend/public')
const sharedBackendDir = resolve(workspaceRoot, 'backend/shared')

function scopeWidgetCss() {
  return {
    postcssPlugin: 'scope-widget-css',
    Rule(rule: { selector: string }) {
      if (
        rule.selector.includes('#feedback-widget')
        || rule.selector.includes('@keyframes')
        || rule.selector.includes('@media')
        || rule.selector.startsWith('@')
      ) {
        return
      }

      if (rule.selector === ':root') {
        rule.selector = '#feedback-widget'
        return
      }

      const selectors = rule.selector.split(',').map(selector => selector.trim())
      rule.selector = selectors.map((selector) => {
        if (selector.includes('#feedback-widget'))
          return selector

        if (selector.startsWith(':host'))
          return selector.replace(':host', '#feedback-widget')

        return `#feedback-widget ${selector}`
      }).join(', ')
    },
  }
}

export default defineConfig(({ mode }) => ({
  root: widgetRoot,
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  css: {
    postcss: {
      plugins: [scopeWidgetCss()],
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          scopeId: 'v-nq-feedback',
        },
      },
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    entries: [entry],
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
}))
