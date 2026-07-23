// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./components/FeedbackWidget.vue', () => ({
  default: {
    expose: ['showFormGrid', 'showForm', 'closeWidget', 'goBack', 'communication'],
    template: '<div>Feedback</div>',
  },
}))

describe('mountFeedbackWidget', () => {
  beforeEach(async () => {
    document.body.innerHTML = '<div class="custom-target"></div>'
    await import('./widget-entry')
  })

  it('marks any mount target with the widget CSS scope', () => {
    const widget = window.mountFeedbackWidget('.custom-target', { app: 'wallet' })
    const target = document.querySelector('.custom-target')

    expect(target?.hasAttribute('data-nimiq-feedback-widget')).toBe(true)

    widget.destroy()
    expect(target?.hasAttribute('data-nimiq-feedback-widget')).toBe(false)
  })
})
