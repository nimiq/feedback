import type { App, SubmissionStatus, SubmissionType } from '~~/shared/types'
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const submissions = sqliteTable('submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  status: text('status').$type<SubmissionStatus>().notNull().default('pending'),
  app: text('app').$type<App>().notNull(),
  type: text('type').$type<SubmissionType>().notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

  description: text('description').notNull(),
  email: text('email'),
  rating: integer('rating'),
  attachments: text('attachments', { mode: 'json' }).$type<string[]>(),
}, table => [
  check('rating', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  index('submissions_status_idx').on(table.status),
  index('submissions_app_idx').on(table.app),
  index('submissions_type_idx').on(table.type),
])
