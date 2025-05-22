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
      autoInit: false,
    },
  },

  hub: {
    database: true,
    blob: true,
  },

  routeRules: {
    '/widget.js': {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript',
      },
      static: true,
    },
    '/widget.css': {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/css',
      },
      static: true,
    },
    '/api/feedback': {
      cors: true,
    },
  },

  runtimeConfig: {
    githubToken: process.env.NUXT_GITHUB_TOKEN,
  },

  // nitro: {
  //   devHandlers: [{
  //     route: '/',
  //     handler: (event) => {
  //       // https://github.com/nitrojs/nitro/issues/539

  //       setHeader(event, 'Access-Control-Allow-Origin', '*')
  //       setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  //       setHeader(event, 'Access-Control-Allow-Headers', '*')
  //       if (event.method === 'OPTIONS')
  //         return ''
  //     },
  //   }],
  // },
})
