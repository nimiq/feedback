import type { I18nContext } from '../locales/types'
import { I18nInjectionKey } from '../locales/types'
import { useRequiredInjection } from './useRequiredInjection'

export function useI18n(): I18nContext {
  return useRequiredInjection(I18nInjectionKey, 'I18nInjectionKey')
}
