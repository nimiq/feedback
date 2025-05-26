import type { LocaleMessages } from '../locales/types'

export function createTranslationFunction(messages: LocaleMessages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      }
      else {
        console.warn(`Translation key "${key}" not found`)
        return key
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`)
      return key
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return paramKey in params ? String(params[paramKey]) : match
      })
    }

    return value
  }
}
