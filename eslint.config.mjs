// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  pnpm: true,
  ignores: ['.pnpm-store/**', 'backend/**', 'dist/**', 'node_modules/**'],
})
