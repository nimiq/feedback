import { randomUUID } from 'node:crypto'
import consola from 'consola'
import { safeParse } from 'valibot'
import { tables } from '../utils/drizzle'

// In the backend we don't distinguish between the different types of forms,
// instead we treat them as a single form with different types.
export default defineEventHandler(async (event) => {
  const { output: query, issues: queryIssues, success: querySuccess } = await getValidatedQuery(event, body => safeParse(QuerySchema, body))
  if (!querySuccess || !query) {
    return createError({ message: 'Invalid query parameters', status: 400, cause: JSON.stringify(queryIssues) })
  }

  const formData = await readFormData(event)
  const formAttachments = formData.getAll('attachments')
  const submission = Object.fromEntries(formData.entries()) as Record<string, any>
  if (formAttachments.length > 0)
    submission.attachments = formAttachments

  const { output: form, issues } = safeParse(FormSchema, submission)
  if (issues) {
    consola.error('Validation issues:', issues)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid submission data',
      data: { success: false, message: 'Invalid submission data', issues: issues.map(issue => issue.message) },
    })
  }

  const id = randomUUID()
  consola.info(`Creating submission with ID ${id} - [${form.type}] ${form.app}`)
  consola.info(form)
  const [fileUploadOk, errorUpload, filesUrls] = await uploadFiles(id, form)
  if (!fileUploadOk) {
    consola.error('File upload error:', errorUpload)
    throw createError({
      statusCode: 400,
      statusMessage: 'File upload error',
      data: { success: false, message: 'There was an error uploading the files', details: errorUpload },
    })
  }

  const [logsUploadOk, logsUploadError, logsUrl] = await uploadLogs(id, form)
  if (!logsUploadOk) {
    consola.error('Logs upload error:', logsUploadError)
    throw createError({
      statusCode: 400,
      statusMessage: 'Logs upload error',
      data: { success: false, message: 'There was an error uploading the logs', details: logsUploadError },
    })
  }

  const markdown = submissionToMarkdown(id, form, filesUrls, logsUrl)
  const [githubIssueOk, githubIssueError, github] = await createGitHubIssue({ form, markdown })
  if (!githubIssueOk) {
    consola.warn('GitHub issue error:', githubIssueError)
  }

  const [linearIssueOk, linearIssueError, linear] = await createLinearIssue({ form, markdown, query })
  if (!linearIssueOk) {
    consola.warn('Linear issue error:', linearIssueError)
  }

  const [slack, slackMessageError] = await createSlackMessage({
    form,
    github: githubIssueOk ? github : undefined,
    linear: linearIssueOk ? linear : undefined,
  })
  if (!slack)
    consola.warn('Slack message error:', slackMessageError)

  const fullSubmission = await useDrizzle().insert(tables.submissions).values({
    ...form,
    id,
    email: form.email || null,
    rating: form.rating || null,
    githubIssue: github?.issueUrl || null,
    linearIssue: linear?.issueUrl || null,
    attachments: filesUrls,
    logs: form.logs || null,
    meta: form.meta || null,
  }).returning().get()

  consola.success('Submission created:', fullSubmission)

  return { success: true, github: github || null, linear: linear || null, slack, submission: fullSubmission } satisfies FeedbackResponse
})
