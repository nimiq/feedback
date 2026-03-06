import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    vue: true,
    pnpm: true,
    ignores: [
      '.nuxt/**',
      '.output/**',
      '.wrangler/**',
      'node_modules/**',
      'public/widget.*',
    ],
  // }, {
  // ...eslintCatalogPlugin.configs?.['recommended'],
  }),
)
