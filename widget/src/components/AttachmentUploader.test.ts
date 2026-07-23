// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useFilesState } from '../composables/useFilesState'
import en from '../locales/en'
import { I18nInjectionKey } from '../locales/types'
import { FilesInjectionKey } from '../types'
import { createTranslationFunction } from '../utils/i18n'
import AttachmentUploader from './AttachmentUploader.vue'

function mountUploader() {
  const filesState = useFilesState()
  const wrapper = mount(AttachmentUploader, {
    global: {
      provide: {
        [FilesInjectionKey as symbol]: filesState,
        [I18nInjectionKey as symbol]: {
          locale: 'en',
          messages: en,
          t: createTranslationFunction(en),
        },
      },
    },
  })

  return { filesState, wrapper }
}

describe('attachmentUploader', () => {
  it('rejects oversized files before adding them', async () => {
    const { filesState, wrapper } = mountUploader()
    const file = new File(['image'], 'large.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 + 1 })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { configurable: true, value: [file] })

    await input.trigger('change')

    expect(filesState.files.value).toHaveLength(0)
    expect(wrapper.text()).toContain('smaller than 10 MB')
  })

  it('uses unique input IDs across widget instances', async () => {
    const first = mountUploader()
    const second = mountUploader()
    await nextTick()

    expect(first.wrapper.get('input[type="file"]').attributes('id'))
      .not
      .toBe(second.wrapper.get('input[type="file"]').attributes('id'))
  })
})
