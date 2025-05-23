import type { App, FormType } from '~~/shared/types'
import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// At the moment we don't track the status of the submissions. We will use GitHub
// issues to track the status of the submissions. We could add a status column
// in the future, but for now, a simple label in the issue will be enough.

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  // status: text('status').$type<SubmissionStatus>().notNull().default('pending'),

  app: text('app').$type<App>().notNull(),
  type: text('type').$type<FormType>().notNull(),

  description: text('description').notNull(),
  email: text('email'),
  rating: integer('rating'),
  attachments: text('attachments', { mode: 'json' }).$type<string[]>(),

  createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),

  githubIssue: text('github_issue', { mode: 'text' }),
}, table => [
  check('rating', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  // index('submissions_status_idx').on(table.status),
  index('submissions_app_idx').on(table.app),
  index('submissions_type_idx').on(table.type),
])
