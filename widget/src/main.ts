import { createApp } from 'vue'
// i18n imports
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import enMessages from './locales/en.json'
import esMessages from './locales/es.json'

import 'virtual:uno.css'

// i18n initialization
const i18n = createI18n({
  legacy: false,
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
    es: esMessages,
  },
})

createApp(App).use(i18n).mount('#app')
