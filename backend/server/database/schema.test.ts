import { getTableColumns } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { submissions } from './schema'

describe('submissions schema', () => {
  it('tracks durable processing and idempotency state', () => {
    const columns = getTableColumns(submissions)

    expect(columns.status.notNull).toBe(true)
    expect(columns.idempotencyKey.isUnique).toBe(true)
    expect(columns.logsUrl).toBeDefined()
    expect(columns.slackSent.notNull).toBe(true)
  })
})
