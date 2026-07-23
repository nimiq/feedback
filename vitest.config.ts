import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#backend': resolve('./backend/shared'),
      '~~': resolve('./backend'),
      'hub:blob': resolve('./tests/stubs/hub-blob.ts'),
      'hub:db': resolve('./tests/stubs/hub-db.ts'),
    },
  },
  test: {
    clearMocks: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['backend/app/**/*.test.ts', 'happy-dom'],
      ['widget/**/*.test.ts', 'happy-dom'],
    ],
    include: [
      'backend/**/*.test.ts',
      'widget/**/*.test.ts',
    ],
    restoreMocks: true,
    unstubGlobals: true,
  },
})
