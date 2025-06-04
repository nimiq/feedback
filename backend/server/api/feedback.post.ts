import { randomUUID } from 'node:crypto'
import consola from 'consola'
import { safeParse } from 'valibot'

// In the backend we don't distinguish between the different types of forms,
// instead we treat them as a single form with different types.
export default defineEventHandler(async (event) => {
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
    consola.error('GitHub issue error:', githubIssueError)
    throw createError({
      statusCode: 500,
      statusMessage: 'GitHub issue error',
      data: { success: false, message: 'There was an error creating the GitHub issue', details: githubIssueError },
    })
  }

  const [slack, slackMessageError] = await createSlackMessage({ form, markdown, github })
  if (!slack)
    consola.warn('Slack message error:', slackMessageError)

  const fullSubmission = await useDrizzle().insert(tables.submissions).values({
    ...form,
    id,
    email: form.email || null,
    rating: form.rating || null,
    githubIssue: github.issueUrl,
    attachments: filesUrls,
    logs: form.logs || null,
  }).returning().get()

  consola.success('Submission created:', fullSubmission)

  return { success: true, github, slack, submission: fullSubmission } satisfies FeedbackResponse
})
