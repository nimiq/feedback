import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import Uno from 'unocss/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const root = resolve(join(fileURLToPath(import.meta.url), '../..'))
const sharedBackendDir = join(root, 'backend/shared')
const widgetFolder = join(root, 'widget')
const isLibMode = process.env.LIB_MODE === 'true'

// Library build configuration
const libConfig = defineConfig({
  publicDir: false,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          scopeId: 'v-nq-feedback',
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'preventAssignment': true,
    }),
    Uno({ configFile: '../uno.config.ts' }),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: join(widgetFolder, 'dist'),
      rollupTypes: true,
      insertTypesEntry: true,
      copyDtsFiles: false,
      entryRoot: join(widgetFolder, 'src'),
    }),
  ],
  root: __dirname,
  build: {
    lib: {
      entry: join(widgetFolder, 'src/index.ts'),
      name: 'NimiqFeedbackWidget',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    outDir: join(widgetFolder, 'dist'),
    rollupOptions: {
      external: ['vue', 'reka-ui'],
      output: {
        globals: {
          vue: 'Vue',
          'reka-ui': 'RekaUI',
        },
      },
    },
  },
  resolve: {
    alias: {
      '#backend': sharedBackendDir,
    },
  },
})

// UMD build configuration (existing widget.js)
const umdConfig = defineConfig({
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
  root: __dirname,
  optimizeDeps: {
    entries: ['src/widget-entry.ts'],
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: join(widgetFolder, 'src/widget-entry.ts'),
      name: 'FeedbackWidget',
      formats: ['umd'],
      fileName: () => 'widget.js',
    },
    outDir: join(root, 'backend/public'),
  },
  resolve: {
    alias: {
      '#backend': sharedBackendDir,
    },
  },
})

export default isLibMode ? libConfig : umdConfig
