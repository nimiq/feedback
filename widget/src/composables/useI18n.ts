import type { I18nContext } from '../locales/types'
import { inject } from 'vue'
import { I18nInjectionKey } from '../locales/types'

export function useI18n(): I18nContext {
  const i18n = inject(I18nInjectionKey)

  if (!i18n) {
    throw new Error('useI18n must be used within a component that has i18n provided')
  }

  return i18n
}

export function useT() {
  const { t } = useI18n()
  return t
}
