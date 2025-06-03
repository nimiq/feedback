import type { I18nContext } from './locales/types'

import { createApp } from 'vue'
import App from './App.vue'
import { localeMessages } from './locales'
import { I18nInjectionKey } from './locales/types'
import { createTranslationFunction } from './utils/i18n'

import 'virtual:uno.css'

const currentMessages = localeMessages.en
const i18nContext: I18nContext = {
  locale: defaultLocale,
  messages: currentMessages,
  t: createTranslationFunction(currentMessages),
}

createApp(App).provide(I18nInjectionKey, i18nContext).mount('#app')
