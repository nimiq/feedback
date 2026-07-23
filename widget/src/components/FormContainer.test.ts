// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useFilesState } from '../composables/useFilesState'
import en from '../locales/en'
import { I18nInjectionKey } from '../locales/types'
import { CommunicationInjectionKey, FilesInjectionKey } from '../types'
import { createTranslationFunction } from '../utils/i18n'
import FormContainer from './FormContainer.vue'

const uuidPattern = /^[0-9a-f-]{36}$/

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('formContainer', () => {
  it('reuses one idempotency key when a failed submission is retried', async () => {
    const requests: FormData[] = []
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => {
      requests.push(init.body as FormData)
      return requests.length === 1
        ? new Response(JSON.stringify({ message: 'failed' }), { status: 500 })
        : new Response(JSON.stringify({ success: true }), { status: 200 })
    }))

    const wrapper = mount(FormContainer, {
      props: { app: 'wallet', type: 'bug' },
      slots: { default: '<textarea name="description">Broken</textarea>' },
      global: {
        provide: {
          [CommunicationInjectionKey as symbol]: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
          [FilesInjectionKey as symbol]: useFilesState(),
          [I18nInjectionKey as symbol]: {
            locale: 'en',
            messages: en,
            t: createTranslationFunction(en),
          },
        },
      },
    })
    const state = wrapper.vm.$.setupState as { acceptTerms: boolean, description: string }
    state.acceptTerms = true
    state.description = 'Broken'
    await nextTick()

    await wrapper.get('form').trigger('submit')
    await nextTick()
    await wrapper.get('form').trigger('submit')

    const keys = requests.map(request => request.get('idempotencyKey'))
    expect(typeof keys[0]).toBe('string')
    expect(keys[0] as string).toMatch(uuidPattern)
    expect(keys[1]).toBe(keys[0])
  })
})
