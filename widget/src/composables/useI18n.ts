import type { I18nContext } from '../locales/types'
import { inject } from 'vue'
import { I18nInjectionKey } from '../locales/types'

export function useI18n(): I18nContext {
  const i18n = inject(I18nInjectionKey)
  return i18n
}
