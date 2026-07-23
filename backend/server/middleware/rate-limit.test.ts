import { beforeEach, describe, expect, it, vi } from 'vitest'

const checkRateLimit = vi.fn()

function createHttpError(input: Record<string, unknown>) {
  return Object.assign(new Error(String(input.statusMessage)), input)
}

describe('feedback rate-limit middleware', () => {
  beforeEach(() => {
    vi.resetModules()
    checkRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetTime: 300,
      retryAfter: 0,
    })
    vi.stubGlobal('checkRateLimit', checkRateLimit)
    vi.stubGlobal('createError', createHttpError)
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('getHeader', () => '203.0.113.10')
    vi.stubGlobal('getRequestIP', () => undefined)
    vi.stubGlobal('getRequestURL', (event: { path: string }) => new URL(event.path, 'https://feedback.test'))
    vi.stubGlobal('setHeader', vi.fn())
  })

  it('limits feedback requests containing query parameters', async () => {
    const { default: middleware } = await import('./rate-limit')

    await middleware({ method: 'POST', path: '/api/feedback?linearWorkspace=product' } as never)

    expect(checkRateLimit).toHaveBeenCalledTimes(1)
  })

  it('returns retry delay instead of reset timestamp in error data', async () => {
    checkRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetTime: 1_800_000_000,
      retryAfter: 45,
    })
    const { default: middleware } = await import('./rate-limit')

    await expect(middleware({ method: 'POST', path: '/api/feedback' } as never))
      .rejects
      .toMatchObject({ data: { retryAfter: 45 } })
  })
})
