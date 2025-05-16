import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxthub/core',
  ],
  future: { compatibilityVersion: 4 },

  eslint: {
    config: {
      standalone: false,
    },
  },

  hub: {
    database: true,
    blob: true,
  },

  routeRules: {
    '/widgets/feedback-widget.js': {
      headers: {
        'cross-origin-embedder-policy': 'require-corp',
        'Access-Control-Allow-Origin': '*',
      },
    },
  },

  runtimeConfig: {
    githubToken: process.env.NUXT_GITHUB_TOKEN,
  },
})
