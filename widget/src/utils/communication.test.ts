import { expect, it, vi } from 'vitest'
import { createWidgetCommunication } from './communication'

it('isolates listener errors and continues notifying listeners', () => {
  const communication = createWidgetCommunication()
  const secondListener = vi.fn()
  vi.spyOn(console, 'error').mockImplementation(() => {})

  communication.on('go-back', () => {
    throw new Error('host listener failed')
  })
  communication.on('go-back', secondListener)

  expect(() => communication.emit('go-back', undefined)).not.toThrow()
  expect(secondListener).toHaveBeenCalledOnce()
})
