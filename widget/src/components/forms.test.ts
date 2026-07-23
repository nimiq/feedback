// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { shallowRef } from 'vue'
import en from '../locales/en'
import { I18nInjectionKey } from '../locales/types'
import { FilesInjectionKey, FormValidationKey } from '../types'
import { createTranslationFunction } from '../utils/i18n'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import IdeaForm from './IdeaForm.vue'

function globalConfig() {
  return {
    provide: {
      [FilesInjectionKey as symbol]: {
        files: shallowRef([]),
        removeFile() {},
        resetFiles() {},
        setFiles() {},
      },
      [FormValidationKey as symbol]: {
        description: shallowRef(''),
        rating: shallowRef(0),
      },
      [I18nInjectionKey as symbol]: {
        locale: 'en',
        messages: en,
        t: createTranslationFunction(en),
      },
    },
  }
}

it.each([BugForm, IdeaForm, FeedbackForm])('uses the shared description field', (component) => {
  const wrapper = mount(component, { global: globalConfig() })

  expect(wrapper.findComponent({ name: 'DescriptionField' }).exists()).toBe(true)
})

it('uses unique rating IDs across widget instances', () => {
  const first = mount(FeedbackForm, { global: globalConfig() })
  const second = mount(FeedbackForm, { global: globalConfig() })

  expect(first.get('input[type="radio"]').attributes('id'))
    .not
    .toBe(second.get('input[type="radio"]').attributes('id'))
})

it('uses unique email IDs across widget instances', () => {
  const first = mount(BugForm, { global: globalConfig() })
  const second = mount(BugForm, { global: globalConfig() })

  expect(first.get('input[type="email"]').attributes('id'))
    .not
    .toBe(second.get('input[type="email"]').attributes('id'))
})
