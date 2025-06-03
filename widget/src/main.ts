import type { I18nContext } from './locales/types'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { localeMessages } from './locales'
import { I18nInjectionKey } from './locales/types'
import { FilesInjectionKey } from './types'

import { createTranslationFunction } from './utils/i18n'
import 'virtual:uno.css'

const defaultLocale = 'en'

const currentMessages = localeMessages[defaultLocale]
const i18nContext: I18nContext = {
  locale: defaultLocale,
  messages: currentMessages,
  t: createTranslationFunction(currentMessages),
}
const files = ref<File[]>([])

createApp(App)
  .provide(I18nInjectionKey, i18nContext)
  .provide(FilesInjectionKey, { files, updateFiles: (newFiles: File[]) => files.value = newFiles })
  .mount('#app')
