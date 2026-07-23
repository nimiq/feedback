import { expect, it } from 'vitest'
import viteConfig from './vite.config'

it('scopes selectors without splitting escaped commas', () => {
  const config = typeof viteConfig === 'function'
    ? viteConfig({ command: 'build', isPreview: false, isSsrBuild: false, mode: 'test' })
    : viteConfig
  const plugin = config.css?.postcss?.plugins?.[0] as {
    Rule: (rule: { selector: string }) => void
  }
  const rule = {
    selector: String.raw`.outline-\[color-mix\(in_oklch\,var\(--colors-white\)_8\%\,transparent\)\]`,
  }

  plugin.Rule(rule)

  expect(rule.selector).toBe(
    String.raw`[data-nimiq-feedback-widget] .outline-\[color-mix\(in_oklch\,var\(--colors-white\)_8\%\,transparent\)\]`,
  )
})
