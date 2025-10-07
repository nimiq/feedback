import { defineConfig, presetUno } from 'unocss'
import { presetOnmax } from 'unocss-preset-onmax'

export default defineConfig({
  presets: [
    presetUno(),
    presetOnmax({
      fontSize: 16,
      baseFontSize: 8,
    }),
  ],
})
