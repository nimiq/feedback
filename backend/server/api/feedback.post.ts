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
    setResponseStatus(event, 400)
    return { success: false, message: 'Invalid submission data', details: issues, issues: issues.map(issue => issue.message) } satisfies FeedbackResponseError
  }

  const id = randomUUID()

  const [fileUploadOk, errorUpload, filesUrls] = await uploadFiles(id, form)
  if (!fileUploadOk) {
    consola.error('File upload error:', errorUpload)
    setResponseStatus(event, 400)
    return { success: false, message: 'There was an error uploading the files', details: errorUpload } satisfies FeedbackResponseError
  }

  const markdown = submissionToMarkdown(id, form, filesUrls)
  const [githubIssueOk, githubIssueError, github] = await createGitHubIssue({ form, markdown })
  if (!githubIssueOk) {
    consola.error('GitHub issue error:', githubIssueError)
    setResponseStatus(event, 500)
    return { success: false, message: 'There was an error creating the GitHub issue', details: githubIssueError } satisfies FeedbackResponseError
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
  }).returning().get()

  consola.success('Submission created:', fullSubmission)

  return { success: true, github, slack, submission: fullSubmission } satisfies FeedbackResponse
})
