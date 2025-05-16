import { resolve } from 'node:path'
import process from 'node:process'
import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'preventAssignment': true,
    }),
  ],
  // Use our custom TypeScript config for widget
  root: __dirname,
  // Specify the TypeScript config file to use
  optimizeDeps: {
    // This helps with imports resolution
    entries: ['app/widget-entry.ts'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'app/widget-entry.ts'),
      name: 'FeedbackWidget',
      formats: ['umd'] as const,
      fileName: () => 'feedback-widget.js',
    },
    outDir: 'public/widgets',
    rollupOptions: {
      external: (id) => {
        // Only externalize Vue itself, not our components
        return id === 'vue' || id.startsWith('vue/')
      },
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
