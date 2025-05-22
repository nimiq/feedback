import type { FeedbackResponse, FeedbackResponseError } from '~~/shared/types'
import { randomUUID } from 'node:crypto'
import consola from 'consola'
import { safeParse } from 'valibot'

// TODO rename to production
const baseUrl = 'https://nq-feedback.maximogarciamtnez.workers.dev/'

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

  const filesUrls: string[] = []
  const promises = form.attachments.map(async (file) => {
    try {
      const name = encodeURI(`${form.app}/${form.type}/${id}__${file.name}`)
      const hubFile = await hubBlob().put(name, file)
      filesUrls.push(`${baseUrl}${hubFile.pathname}`)
    }
    catch (error: any) {
      throw new Error(`Error processing attachment: ${JSON.stringify(error)}`)
    }
  })

  const results = await Promise.allSettled(promises)
  const errors = results.filter(result => result.status === 'rejected')
  if (errors.length > 0) {
    consola.error('File upload errors:', errors)
    setResponseStatus(event, 400)
    return { success: false, message: 'Error processing attachments', details: errors.map(error => error.reason) } satisfies FeedbackResponseError
  }

  const { type, app, rating } = form
  const title = `[${app}] - ${{ feedback: 'Feedback', bug: 'Bug report', idea: 'Idea' }[type]}`
  const labels = [`app/${app}`, `kind/${type}`, type === 'feedback' ? `rating-${rating}` : undefined].filter(Boolean) as string[]
  const markdown = submissionToMarkdown(id, form)
  const github = await createGitHubIssue({ title, labels, markdown })

  const fullSubmission = await useDrizzle().insert(tables.submissions).values({
    ...form,
    id,
    githubIssue: github.issueUrl,
    attachments: filesUrls,
  }).returning().get()

  consola.success('Submission created:', fullSubmission)

  return { success: true, github, submission: fullSubmission } satisfies FeedbackResponse
})
