import { resolve } from 'node:path'
import process from 'node:process'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import Uno from 'unocss/vite'
import { defineConfig } from 'vite'

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
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/widget-entry.ts'),
      name: 'FeedbackWidget',
      formats: ['umd'] as const,
      fileName: () => 'feedback-widget.full.js',
    },
    outDir: '../public/widgets',
    rollupOptions: {},
  },
})
