import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('feedback submission workflow', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('persists the submission before side effects and stores only the logs URL', async () => {
    const calls: string[] = []
    let row: Record<string, any> | undefined
    const updates: Record<string, any>[] = []
    const database = {
      insert: () => ({
        values: (values: Record<string, any>) => ({
          onConflictDoNothing: () => ({
            returning: () => ({
              get: async () => {
                calls.push('insert')
                row = {
                  attachments: [],
                  createdAt: '2026-07-23',
                  dev: false,
                  githubIssue: null,
                  linearIdentifier: null,
                  linearIssue: null,
                  logs: null,
                  logsUrl: null,
                  slackSent: false,
                  updatedAt: '2026-07-23',
                  ...values,
                }
                return row
              },
            }),
          }),
        }),
      }),
      update: () => ({
        set: (values: Record<string, any>) => ({
          where: () => ({
            returning: () => ({
              get: async () => {
                updates.push(values)
                row = { ...row, ...values }
                return row
              },
            }),
          }),
        }),
      }),
    }

    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('getValidatedQuery', async () => ({ output: { linearLabels: [] }, success: true }))
    vi.stubGlobal('readFormData', async () => {
      const data = new FormData()
      data.set('acceptTerms', 'on')
      data.set('app', 'wallet')
      data.set('description', 'Broken transfer')
      data.set('idempotencyKey', 'ddcdce7c-6b65-4e6d-b6a6-c0344a5f18ce')
      data.set('logs', 'private logs')
      data.set('type', 'bug')
      return data
    })
    vi.stubGlobal('useDrizzle', () => database)
    vi.stubGlobal('uploadFiles', vi.fn())
    vi.stubGlobal('uploadLogs', vi.fn(async () => {
      calls.push('upload-logs')
      return [true, undefined, 'https://feedback.example/logs/file.txt']
    }))
    vi.stubGlobal('submissionToMarkdown', vi.fn(() => 'markdown'))
    vi.stubGlobal('createGitHubIssue', vi.fn(async () => [true, undefined, { issueUrl: 'https://github.test/1' }]))
    vi.stubGlobal('createLinearIssue', vi.fn(async () => [true, undefined, undefined]))
    vi.stubGlobal('createSlackMessage', vi.fn(async () => [true, undefined, undefined]))

    const { default: handler } = await import('./feedback.post')
    const response = await handler({} as any)

    expect(calls).toEqual(['insert', 'upload-logs'])
    expect(updates.some(update => 'logs' in update)).toBe(false)
    expect(row).toMatchObject({
      logs: null,
      logsUrl: 'https://feedback.example/logs/file.txt',
      status: 'completed',
    })
    expect(response.submission).not.toHaveProperty('logs')
    expect(response.submission).not.toHaveProperty('idempotencyKey')
    expect(response.submission).not.toHaveProperty('status')
  })
})
