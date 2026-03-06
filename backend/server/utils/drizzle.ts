import { db, schema as tables } from 'hub:db'

export { and, eq, or, sql } from 'drizzle-orm'
export { tables }

export function useDrizzle() {
  return db
}

export type Submission = typeof tables.submissions.$inferSelect
