import { createExternalPackageIconLoader } from '@iconify/utils/lib/loader/external-pkg'

import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetIcons } from 'unocss'
import { presetOnmax } from 'unocss-preset-onmax'

export default defineConfig({
  presets: [
    presetOnmax({
      presets: {
        wind4: { preflights: { reset: false } },
        unoVue: false,
      },
    }),
    presetNimiq({
      utilities: true,
      fonts: false,
      attributifyUtilities: true,
    }),

    presetIcons({
      collections: {
        ...createExternalPackageIconLoader('nimiq-icons'),
      },
    }),
  ],
})
