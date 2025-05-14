import { createExternalPackageIconLoader } from '@iconify/utils/lib/loader/external-pkg'

import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import { presetOnmax } from 'unocss-preset-onmax'
import { presetScalePx } from 'unocss-preset-scale-px'

export default defineConfig({
  presets: [
    presetWind3(),
    presetNimiq({
      utilities: true,
      attributifyUtilities: true,
      typography: true,
      staticContent: true,
      fonts: false,
    }),
    presetOnmax({ presets: { wind4: false } }),
    presetScalePx(),
    presetIcons({
      collections: {
        ...createExternalPackageIconLoader('nimiq-icons'),
      },
    }),
  ],

})
