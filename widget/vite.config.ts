import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import selectorParser from 'postcss-selector-parser'
import { defineConfig } from 'vite'

const widgetRoot = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(widgetRoot, '..')
const entry = resolve(widgetRoot, 'src/widget-entry.ts')
const outputFolder = resolve(workspaceRoot, 'backend/public')
const sharedBackendDir = resolve(workspaceRoot, 'backend/shared')
const widgetScope = '[data-nimiq-feedback-widget]'

function scopeWidgetCss() {
  return {
    postcssPlugin: 'scope-widget-css',
    Rule(rule: { parent?: { name?: string, type?: string }, selector: string }) {
      if (rule.parent?.type === 'atrule' && rule.parent.name?.endsWith('keyframes'))
        return

      rule.selector = selectorParser((selectors) => {
        selectors.each((selector) => {
          if (selector.toString().includes(widgetScope))
            return

          const first = selector.at(0)
          if (first?.type === 'pseudo' && (first.value === ':root' || first.value === ':host')) {
            first.replaceWith(selectorParser.attribute({ attribute: 'data-nimiq-feedback-widget' }))
            return
          }

          selector.prepend(selectorParser.combinator({ value: ' ' }))
          selector.prepend(selectorParser.attribute({ attribute: 'data-nimiq-feedback-widget' }))
        })
      }).processSync(rule.selector)
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
