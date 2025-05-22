import type { BlobObject } from '@nuxthub/core'
import type { InferOutput } from 'valibot'
import type { FeedbackResponse, FeedbackResponseError } from '~~/shared/types'
import { Octokit } from '@octokit/rest'
import { array, file, integer, maxLength, maxSize, maxValue, mimeType, minLength, minValue, object, optional, picklist, pipe, safeParse, string, transform } from 'valibot'
import { apps, imageMimeTypes } from '~~/shared/utils'

// TODO rename to production
const baseUrl = 'https://nq-feedback.maximogarciamtnez.workers.dev/'

// In the backend we don't distinguish between the different types of forms,
// instead we treat them as a single form with different types.
const FormSchema = object({
  type: picklist(['feedback', 'bug', 'idea'], 'Invalid submission type'),
  app: picklist(apps, `Invalid app name. Use one of the following: ${apps.join(', ')}`),
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
  // Extract the attachments from the FormData
  const formAttachments = formData.getAll('attachments')
  // Retrieve the rest of the form data
  const data = Object.fromEntries(formData.entries()) as Record<string, any>
  // Then collect attachments separately
  if (formAttachments.length > 0)
    data.attachments = formAttachments

  const { output, issues } = safeParse(FormSchema, data)
  if (issues) {
    console.error('Validation issues:', issues)
    // return createError({ statusCode: 400, message: `Invalid submission data: ${JSON.stringify(issues)} ${JSON.stringify(submissionData)}` })
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Invalid submission data',
      details: issues,
      issues: issues.map(issue => issue.message),
    } satisfies FeedbackResponseError
  }

  const { type, app, attachments } = output
  const hubFiles: BlobObject[] = []

  // Handle file uploads if present
  for (const file of attachments) {
    try {
      // TODO Add issue id to the filename instead of random suffix. Also improved tracking of the file/issue
      const name = encodeURI(`${app}/${type}/${file.name}`)
      hubFiles.push(await hubBlob().put(name, file, { addRandomSuffix: true }))
    }
    catch (error: any) {
      return createError({ statusCode: 400, statusMessage: error.message || 'File upload error', message: error.message || 'Error processing attachment' })
    }
  }

  const github = await writeToGitHubIssue(output, hubFiles)

  return {
    success: true,
    github,
  } satisfies FeedbackResponse
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
