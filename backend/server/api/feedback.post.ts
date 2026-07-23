import type { InferOutput } from 'valibot'
import type { Submission } from '../utils/drizzle'
import { randomUUID } from 'node:crypto'
import consola from 'consola'
import { safeParse } from 'valibot'
import { eq, tables } from '../utils/drizzle'
import { FormSchema } from '../utils/valibot-schemas'

function toResponse(submission: Submission): FeedbackResponse {
  return {
    success: true,
    github: submission.githubIssue ? { issueUrl: submission.githubIssue } : null,
    linear: submission.linearIssue && submission.linearIdentifier
      ? { identifier: submission.linearIdentifier, issueUrl: submission.linearIssue }
      : null,
    slack: submission.slackSent,
    submission: {
      app: submission.app,
      attachments: submission.attachments,
      createdAt: submission.createdAt,
      description: submission.description,
      email: submission.email,
      githubIssue: submission.githubIssue,
      id: submission.id,
      linearIssue: submission.linearIssue,
      meta: submission.meta,
      rating: submission.rating,
      type: submission.type,
      updatedAt: submission.updatedAt,
    },
  }
}

async function saveSubmission(id: string, values: Partial<Submission>): Promise<Submission> {
  return useDrizzle()
    .update(tables.submissions)
    .set(values)
    .where(eq(tables.submissions.id, id))
    .returning()
    .get()
}

async function reserveSubmission(form: InferOutput<typeof FormSchema>): Promise<{ row: Submission, resume: boolean }> {
  const database = useDrizzle()
  const idempotencyKey = form.idempotencyKey ?? randomUUID()
  const id = randomUUID()
  const inserted = await database.insert(tables.submissions).values({
    app: form.app,
    attachments: [],
    description: form.description,
    email: form.email || null,
    id,
    idempotencyKey,
    meta: form.meta || null,
    rating: form.rating || null,
    status: 'processing',
    type: form.type,
  }).onConflictDoNothing({
    target: tables.submissions.idempotencyKey,
  }).returning().get()

  if (inserted)
    return { row: inserted, resume: false }

  const existing = await database.select()
    .from(tables.submissions)
    .where(eq(tables.submissions.idempotencyKey, idempotencyKey))
    .get()

  if (!existing)
    throw createError({ statusCode: 500, statusMessage: 'Unable to reserve submission' })
  if (existing.status === 'completed')
    return { row: existing, resume: false }
  if (existing.status === 'processing') {
    throw createError({
      statusCode: 409,
      statusMessage: 'Submission is already processing',
      data: { success: false, message: 'This submission is already processing' },
    })
  }

  return { row: await saveSubmission(existing.id, { status: 'processing' }), resume: true }
}

// The backend treats all form variants as one durable submission workflow.
export default defineEventHandler(async (event) => {
  const { output: query, issues: queryIssues, success: querySuccess } = await getValidatedQuery(event, body => safeParse(QuerySchema, body))
  if (!querySuccess || !query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: { success: false, message: 'Invalid query parameters', issues: queryIssues?.map(issue => issue.message) },
    })
  }

  const formData = await readFormData(event)
  const formAttachments = formData.getAll('attachments')
  const submission = Object.fromEntries(formData.entries()) as Record<string, any>
  if (formAttachments.length > 0)
    submission.attachments = formAttachments

  const { output: form, issues } = safeParse(FormSchema, submission)
  if (issues) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid submission data',
      data: { success: false, message: 'Invalid submission data', issues: issues.map(issue => issue.message) },
    })
  }

  const reservation = await reserveSubmission(form)
  let current = reservation.row
  if (!reservation.resume && current.status === 'completed')
    return toResponse(current)

  consola.info(`Processing submission ${current.id}`)

  try {
    let filesUrls = current.attachments ?? []
    if (filesUrls.length === 0 && form.attachments.length > 0) {
      const [ok, uploadError, urls] = await uploadFiles(current.id, form)
      if (!ok)
        throw createError({ statusCode: 400, statusMessage: 'File upload error', data: { success: false, message: 'There was an error uploading the files' }, cause: uploadError })
      filesUrls = urls
      current = await saveSubmission(current.id, { attachments: filesUrls })
    }

    let logsUrl = current.logsUrl ?? undefined
    if (!logsUrl && form.logs) {
      const [ok, uploadError, url] = await uploadLogs(current.id, form)
      if (!ok)
        throw createError({ statusCode: 400, statusMessage: 'Logs upload error', data: { success: false, message: 'There was an error uploading the logs' }, cause: uploadError })
      logsUrl = url
      current = await saveSubmission(current.id, { logsUrl: logsUrl ?? null })
    }

    const markdown = submissionToMarkdown(current.id, form, filesUrls, logsUrl)

    if (!current.githubIssue) {
      const [ok, issueError, github] = await createGitHubIssue({ form, markdown })
      if (ok) {
        current = await saveSubmission(current.id, { githubIssue: github.issueUrl })
      }
      else {
        consola.warn('GitHub issue creation failed:', issueError)
      }
    }

    if (!current.linearIssue) {
      const [ok, issueError, linear] = await createLinearIssue({ form, markdown, query })
      if (ok && linear) {
        current = await saveSubmission(current.id, {
          linearIdentifier: linear.identifier,
          linearIssue: linear.issueUrl,
        })
      }
      else if (!ok) {
        consola.warn('Linear issue creation failed:', issueError)
      }
    }

    if (!current.slackSent) {
      const [ok, messageError] = await createSlackMessage({
        form,
        github: current.githubIssue ? { issueUrl: current.githubIssue } : undefined,
        linear: current.linearIssue && current.linearIdentifier
          ? { identifier: current.linearIdentifier, issueUrl: current.linearIssue }
          : undefined,
      })
      if (ok)
        current = await saveSubmission(current.id, { slackSent: true })
      else
        consola.warn('Slack message creation failed:', messageError)
    }

    current = await saveSubmission(current.id, { status: 'completed' })
    return toResponse(current)
  }
  catch (error) {
    await saveSubmission(current.id, { status: 'failed' }).catch(saveError => consola.error('Could not mark submission as failed:', saveError))
    throw error
  }
})
