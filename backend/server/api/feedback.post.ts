import type { BlobObject } from '@nuxthub/core'
import type { InferOutput } from 'valibot'
import type { App, FeedbackResponse, FeedbackResponseError } from '~~/shared/types'
import { Octokit } from '@octokit/rest'
import { array, file, integer, maxLength, maxSize, maxValue, mimeType, minLength, minValue, object, optional, picklist, pipe, safeParse, string, transform } from 'valibot'
import { apps, imageMimeTypes } from '~~/shared/utils'

// TODO rename to production
const baseUrl = 'https://nq-feedback.maximogarciamtnez.workers.dev/'

// In the backend we don't distinguish between the different types of forms,
// instead we treat them as a single form with different types.
const FormSchema = object({
  type: picklist(['feedback', 'bug', 'idea'], 'Invalid submission type'),
  app: picklist(apps as App[], `Invalid app name. Use one of the following: ${apps.join(', ')}`),
  description: string('Description must be a string'),
  email: optional(string('Email must be a string')),
  rating: optional(pipe(
    string(),
    transform(Number),
    integer('Rating must be an integer'),
    minValue(0, 'Rating must be at least 0'),
    maxValue(5, 'Rating cannot exceed 5'),
  )),
  attachments: optional(pipe(
    array(pipe(
      file('Select an image file.'),
      mimeType(imageMimeTypes as `${string}/${string}`[], 'Select an image.'),
      maxSize(1024 * 1024 * 10, 'Select a file smaller than 10 MB.'),
    ), 'Attachments must be an array of images'),
    minLength(0),
    maxLength(5),
  ), []),
})

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const formAttachments = formData.getAll('attachments')
  const data = Object.fromEntries(formData.entries()) as Record<string, any>
  if (formAttachments.length > 0)
    data.attachments = formAttachments

  const { output, issues } = safeParse(FormSchema, data)
  if (issues) {
    console.error('Validation issues:', issues)
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Invalid submission data',
      details: issues,
      issues: issues.map(issue => issue.message),
    } satisfies FeedbackResponseError
  }

  const { type, app, attachments, description, email, rating } = output
  const newSubmission = await useDrizzle().insert(tables.submissions).values({ type, app, description, email, rating }).returning().get()

  const hubFiles: BlobObject[] = []
  const promises = attachments.map(async (file) => {
    try {
      const name = encodeURI(`${app}/${type}/${newSubmission.id}__${file.name}`)
      const hubFile = await hubBlob().put(name, file)
      hubFiles.push(hubFile)
    }
    catch (error: any) {
      throw new Error(`Error processing attachment: ${JSON.stringify(error)}`)
    }
  })

  const results = await Promise.allSettled(promises)
  const errors = results.filter(result => result.status === 'rejected')
  if (errors.length > 0) {
    console.error('File upload errors:', errors)
    setResponseStatus(event, 400)
    await useDrizzle().delete(tables.submissions).where(eq(tables.submissions.id, newSubmission.id)).execute()
    return { success: false, message: 'Error processing attachments', details: errors.map(error => error.reason) } satisfies FeedbackResponseError
  }

  const github = await writeToGitHubIssue(output, hubFiles)

  await useDrizzle().update(tables.submissions).set({
    githubIssue: github.issueUrl,
    attachments: hubFiles.map(file => file.pathname),
  }).where(eq(tables.submissions.id, newSubmission.id)).execute()

  return { success: true, github } satisfies FeedbackResponse
})

async function writeToGitHubIssue({ app, description, type, email, rating }: InferOutput<typeof FormSchema>, hubFiles: BlobObject[]) {
  const config = useRuntimeConfig()

  // Check if GitHub token exists
  if (!config.githubToken)
    throw createError({ statusCode: 500, message: 'GitHub token not configured' })
  const octokit = new Octokit({ auth: config.githubToken })

  let bodyText = description
  if (hubFiles.length > 0) {
    bodyText += '\n\n### Attachments:\n\n'
    hubFiles.forEach((file: BlobObject, index: number) => bodyText += `![Image for ${type}-${index}](${baseUrl}${file.pathname})\n`)
  }
  if (email)
    bodyText += `\n\n### Contact\n\n${email}`

  // Prepare issue creation params based on submission type
  const issueParams: any = { owner: 'onmax', repo: 'nimiq-feedback', body: bodyText, labels: [`app/${app}`, `kind/${type}`] }
  issueParams.title = {
    feedback: `[${app}] Feedback`,
    bug: `[${app}] Bug Report`,
    idea: `[${app}] Feature Idea`,
  }[type]

  if (type === 'feedback')
    issueParams.labels.push(`rating-${rating}`)

  // Create issue in the repo
  const response = await octokit.issues.create(issueParams)
  if (response.status !== 201)
    throw createError({ statusCode: 500, message: 'Error creating issue on GitHub' })

  return { issueUrl: response.data.url, issueNumber: response.data.number } satisfies FeedbackResponse['github']
}
