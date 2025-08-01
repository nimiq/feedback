import { createExternalPackageIconLoader } from '@iconify/utils/lib/loader/external-pkg'

import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetIcons } from 'unocss'
import { presetOnmax } from 'unocss-preset-onmax'

export default defineConfig({
  content: {
    filesystem: ['widget/src/**/*.{js,ts,vue}'],
  },
  presets: [
    presetOnmax({
      presets: {
        wind4: { preflights: { reset: false, theme: { mode: true } } },
        unoVue: false,
      },
    }),
    presetNimiq({
      utilities: true,
      preflight: false, // Disable global resets and base styles
      fonts: false,
      attributifyUtilities: true,
    }),

    presetIcons({
      collections: {
        ...createExternalPackageIconLoader('nimiq-icons'),
      },
    }),
  ],
  outputToCssLayers: false,
})
