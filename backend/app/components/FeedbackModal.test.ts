// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const PassThrough = {
  template: '<div><slot /></div>',
}
it('keeps mounted widget available after an error and retry', async () => {
  const showFormGrid = vi.fn()
  const destroy = vi.fn()
  const widgetInstance = {
    closeWidget: vi.fn(),
    communication: {
      emit: vi.fn(),
      off: vi.fn(),
      on: vi.fn(),
    },
    destroy,
    goBack: vi.fn(),
    showForm: vi.fn(),
    showFormGrid,
  }
  vi.stubGlobal('useHead', vi.fn())

  const wrapper = mount(FeedbackModal, {
    global: {
      stubs: {
        DialogClose: PassThrough,
        DialogContent: PassThrough,
        DialogOverlay: PassThrough,
        DialogPortal: PassThrough,
        DialogRoot: PassThrough,
        DialogTitle: PassThrough,
        DialogTrigger: PassThrough,
        Icon: true,
        NuxtLink: true,
        Transition: false,
      },
    },
  })

  const setupState = (wrapper.vm.$ as any).setupState as {
    currentView: string
    errorData: unknown
    widgetInstance: typeof widgetInstance
  }
  setupState.widgetInstance = widgetInstance
  setupState.errorData = { error: 'failed', success: false }
  setupState.currentView = 'error'
  await nextTick()

  expect(wrapper.find('[data-feedback-widget]').exists()).toBe(true)
  await wrapper.get('[data-action="retry"]').trigger('click')
  expect(showFormGrid).toHaveBeenCalledOnce()
  expect(destroy).not.toHaveBeenCalled()
})
