import { safeParse } from 'valibot'
import { describe, expect, it } from 'vitest'
import { FormSchema } from './valibot-schemas'

const validBug = {
  acceptTerms: 'true',
  app: 'wallet',
  description: 'The send button does not respond.',
  type: 'bug',
}

describe('formSchema', () => {
  it('reports malformed metadata as a validation issue', () => {
    expect(() => safeParse(FormSchema, { ...validBug, meta: '{bad' })).not.toThrow()
    expect(safeParse(FormSchema, { ...validBug, meta: '{bad' }).success).toBe(false)
  })

  it.each([
    [{ ...validBug, app: '   ' }, 'app'],
    [{ ...validBug, description: '   ' }, 'description'],
    [{ ...validBug, type: 'feedback' }, 'rating'],
    [{ ...validBug, type: 'feedback', rating: '0' }, 'rating'],
  ])('rejects invalid required submission data: %s', (input, expectedPath) => {
    const result = safeParse(FormSchema, input)

    expect(result.success).toBe(false)
    expect(result.issues?.some(issue => issue.path?.some(path => path.key === expectedPath))).toBe(true)
  })

  it.each([
    ['app', 'a'.repeat(65)],
    ['description', 'd'.repeat(10_001)],
    ['email', 'e'.repeat(321)],
    ['logs', 'l'.repeat(512 * 1024 + 1)],
    ['meta', JSON.stringify({ value: 'm'.repeat(64 * 1024) })],
  ])('bounds %s size', (field, value) => {
    const result = safeParse(FormSchema, { ...validBug, [field]: value })

    expect(result.success).toBe(false)
  })
})
