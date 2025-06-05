import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    vue: true,
    unocss: true,
    pnpm: true,
    ignores: ['./public/widget.*'],
  // }, {
  // ...eslintCatalogPlugin.configs?.['recommended'],
  }),
)
