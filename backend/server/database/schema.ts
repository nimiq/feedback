import type { FormType } from '~~/shared/types'
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type SubmissionStatus = 'processing' | 'completed' | 'failed'

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  // Legacy rows predate idempotency keys; every new submission supplies one.
  idempotencyKey: text('idempotency_key').unique(),
  status: text('status').$type<SubmissionStatus>().notNull().default('processing'),

  app: text('app').notNull(),
  type: text('type').$type<FormType>().notNull(),
  dev: integer('dev', { mode: 'boolean' }).notNull().default(false),

  description: text('description').notNull(),
  email: text('email'),
  rating: integer('rating'),
  attachments: text('attachments', { mode: 'json' }).$type<string[]>(),
  // Kept for migration compatibility. New submissions store only the blob URL.
  logs: text('logs'),
  logsUrl: text('logs_url'),
  meta: text('meta', { mode: 'json' }).$type<Record<string, any>>(),

  createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),

  githubIssue: text('github_issue', { mode: 'text' }),
  linearIssue: text('linear_issue', { mode: 'text' }),
  linearIdentifier: text('linear_identifier', { mode: 'text' }),
  slackSent: integer('slack_sent', { mode: 'boolean' }).notNull().default(false),
}, table => [
  check('rating', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  index('submissions_status_idx').on(table.status),
  index('submissions_app_idx').on(table.app),
  index('submissions_type_idx').on(table.type),
])

export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  resetTime: integer('reset_time').notNull(),
}, table => [
  index('rate_limits_reset_time_idx').on(table.resetTime),
])
