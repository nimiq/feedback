// @ts-check
import antfu from '@antfu/eslint-config'
// import eslintCatalogPlugin from 'eslint-plugin-pnpm-catalog'

export default antfu({
  formatters: true,
  vue: true,
  unocss: true,
  pnpm: true,
  ignores: ['./backend/**/*', './dist/**/*', './node_modules/**/*'],
// }, {
  // ...eslintCatalogPlugin.configs?.['recommended'],
})
