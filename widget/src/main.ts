import type { I18nContext } from './locales/types'

import { createApp } from 'vue'
import App from './App.vue'
import { useFilesState } from './composables/useFilesState'
import { localeMessages } from './locales'
import { I18nInjectionKey } from './locales/types'
import { FilesInjectionKey } from './types'

import { createTranslationFunction } from './utils/i18n'
import './styles/widget.css'

const defaultLocale = 'en'

const currentMessages = localeMessages[defaultLocale]
const i18nContext: I18nContext = {
  locale: defaultLocale,
  messages: currentMessages,
  t: createTranslationFunction(currentMessages),
}
const filesState = useFilesState()

createApp(App)
  .provide(I18nInjectionKey, i18nContext)
  .provide(FilesInjectionKey, filesState)
  .mount('#app')
