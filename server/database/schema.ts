import { sqliteTable, integer, text, check, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export type App = 'nimiq-wallet' | 'nimiq-pay'
export type SubmissionType = 'bug' | 'idea' | 'feedback'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

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
  attachements: text('attachements', { mode: 'json' }).$type<string[]>(),
}, (table) => [
  check("rating", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  index("submissions_status_idx").on(table.status),
  index("submissions_app_idx").on(table.app),
  index("submissions_type_idx").on(table.type),
]);
