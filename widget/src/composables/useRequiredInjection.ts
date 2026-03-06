import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export function useRequiredInjection<T>(key: InjectionKey<T>, name: string): T {
  const value = inject(key)

  if (!value)
    throw new Error(`${name} was not provided`)

  return value
}
