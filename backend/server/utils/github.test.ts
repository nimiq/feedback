import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGitHubIssue } from './github'

const create = vi.fn()

vi.mock('@octokit/rest', () => ({
  Octokit: class {
    issues = { create }
  },
}))

describe('createGitHubIssue', () => {
  beforeEach(() => {
    create.mockReset()
    vi.stubGlobal('useSafeRuntimeConfig', () => ({
      github: { token: 'secret', owner: 'nimiq', repo: 'feedback' },
    }))
  })

  it('does not include private submission content in API errors', async () => {
    create.mockRejectedValue(new Error('network failed'))

    const result = await createGitHubIssue({
      form: {
        acceptTerms: true,
        app: 'wallet',
        description: 'private customer report',
        type: 'bug',
      },
      markdown: 'private logs and customer email',
    })

    expect(result[0]).toBe(false)
    expect(result[1]).not.toContain('private logs')
    expect(result[1]).not.toContain('customer email')
  })
})
