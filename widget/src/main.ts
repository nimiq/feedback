import type { I18nContext } from './locales/types'

import { createApp } from 'vue'
import App from './App.vue'
import { enMessages } from './locales/en'
import { esMessages } from './locales/es'
import { I18nInjectionKey } from './locales/types'
import { createTranslationFunction } from './utils/i18n'

import 'virtual:uno.css'

// Default locale setup
const defaultLocale = 'en'
const localeMessages = {
  en: enMessages,
  es: esMessages,
}

const currentMessages = localeMessages[defaultLocale]
const i18nContext: I18nContext = {
  locale: defaultLocale,
  messages: currentMessages,
  t: createTranslationFunction(currentMessages),
}

createApp(App).provide(I18nInjectionKey, i18nContext).mount('#app')
