// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  unocss: true,
  pnpm: true,
  typescript: true,
  ignores: ['./backend/**/*', './dist/**/*', './node_modules/**/*'],
  rules: {
    'no-console': 'off', // TODO Remove me
  },
})
