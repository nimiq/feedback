import { randomUUID } from 'node:crypto'
import consola from 'consola'
import { safeParse } from 'valibot'

// In the backend we don't distinguish between the different types of forms,
// instead we treat them as a single form with different types.
export default defineEventHandler(async (event) => {
  // Validate query parameters for test mode
  const { output: query, issues: queryIssues, success: querySuccess } = await getValidatedQuery(event, body => safeParse(QuerySchema, body))
  if (!querySuccess || !query) {
    return createError({ message: 'Invalid query parameters', status: 400, cause: JSON.stringify(queryIssues) })
  }

  const isTestMode = query.test

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
  consola.info(`${isTestMode ? '[TEST MODE] ' : ''}Creating submission with ID ${id} - [${form.type}] ${form.app}`)
  consola.info(form)

  if (isTestMode) {
    // In test mode, return mock data without creating actual entries
    consola.info('[TEST MODE] Skipping actual data creation - returning mock response')

    const mockResponse = {
      success: true as const,
      github: {
        issueUrl: `https://github.com/test/repo/issues/123`,
      },
      slack: true,
      submission: {
        type: form.type,
        app: form.app,
        description: form.description,
        id,
        email: form.email || null,
        rating: form.rating || null,
        githubIssue: `https://github.com/test/repo/issues/123`,
        attachments: form.attachments?.map((_, index) => `https://test.example.com/images/test-${index}.jpg`) || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    } satisfies FeedbackResponse

    return mockResponse
  }

  // Normal mode - proceed with actual data creation
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

  const [slack, slackMessageError] = await createSlackMessage({ form, github })
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
