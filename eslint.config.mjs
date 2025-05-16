// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  unocss: true,
  pnpm: true,
  ignores: ['./backend/**/*'],
})
