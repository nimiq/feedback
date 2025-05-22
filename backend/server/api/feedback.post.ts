import type { FeedbackResponseError } from '~~/shared/types'
import { Octokit } from '@octokit/rest'
import { array, file, integer, literal, maxLength, maxSize, maxValue, mimeType, minLength, minValue, object, optional, pipe, safeParse, string, transform, variant } from 'valibot'
import { imageMimeTypes } from '~~/shared/utils'

const DescriptionSchema = string('Description must be a string')
const ImageSchema = pipe(
  file('Select an image file.'),
  mimeType(imageMimeTypes as `${string}/${string}`[], 'Select an image.'),
  maxSize(1024 * 1024 * 10, 'Select a file smaller than 10 MB.'),
)

const AttachmentsSchema = optional(pipe(
  array(ImageSchema, 'Attachments must be an array of images'),
  minLength(0),
  maxLength(5),
))

const FeedbackSchema = object({
  type: literal('feedback'),
  rating: pipe(
    string(),
    transform(Number),
    integer('Rating must be an integer'),
    minValue(0, 'Rating must be at least 0'),
    maxValue(5, 'Rating cannot exceed 5'),
  ),
  description: DescriptionSchema,
})

const BugSchema = object({
  type: literal('bug'),
  description: DescriptionSchema,
  email: optional(string('Email must be a string')),
  attachments: AttachmentsSchema,
})

const IdeaSchema = object({
  type: literal('idea'),
  description: DescriptionSchema,
  attachments: AttachmentsSchema,
})

// Combined schema for all submission types
const SubmissionSchema = variant('type', [FeedbackSchema, BugSchema, IdeaSchema])

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  // Extract the attachments from the FormData
  const attachments = formData.getAll('attachments')
  // Retrieve the rest of the form data
  const submissionData = Object.fromEntries(formData.entries()) as Record<string, any>
  // Then collect attachments separately
  if (attachments.length > 0)
    submissionData.attachments = attachments

  const { output, issues } = safeParse(SubmissionSchema, submissionData)
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

  const contentType = getRequestHeader(event, 'content-type')
  const fileUrls: string[] = []
  if (contentType?.includes('multipart/form-data')) {
    // Handle form data
    // Validate input using valibot

    // Handle file uploads if present
    if (formData.has('attachments')) {
      const attachmentFiles = formData.getAll('attachments')

      if (attachmentFiles.length > 5)
        return createError({ statusCode: 400, statusMessage: 'Too many attachments', message: 'A maximum of 5 attachments is allowed' })

      // Process each attachment
      for (const file of attachmentFiles) {
        if (file instanceof File && file.size) {
          try {
            const uploadResult = await hubBlob().put(file.name, file, { addRandomSuffix: true, prefix: `${submissionData.type || 'unknown'}-attachments` })
            fileUrls.push(uploadResult as unknown as string)
          }
          catch (error: any) {
            return createError({ statusCode: 400, statusMessage: error.message || 'File upload error', message: error.message || 'Error processing attachment' })
          }
        }
      }
    }
  }

  const { type, description } = output
  const config = useRuntimeConfig()

  // Check if GitHub token exists
  if (!config.githubToken)
    return createError({ statusCode: 500, message: 'GitHub token not configured' })

  // Initialize Octokit with GitHub token
  const octokit = new Octokit({ auth: config.githubToken })

  // Prepare the body text with attachments if present
  let bodyText = description

  // Add attachments to the body if present
  if (fileUrls && fileUrls.length > 0) {
    bodyText += '\n\n### Attachments:\n'
    fileUrls.forEach((url: string, index: number) => bodyText += `\n${index + 1}. ${url}`)
  }

  // Prepare issue creation params based on submission type
  const issueParams: any = {
    owner: 'onmax',
    repo: 'nimiq-feedback',
    body: bodyText,
    labels: [type],
  }

  // Add type-specific data to issue
  switch (type) {
    case 'feedback': {
      const { rating } = output
      issueParams.title = `Feedback: Rating ${rating}/5`
      issueParams.labels.push(`rating-${rating}`)
      break
    }
    case 'bug':
      issueParams.title = 'Bug Report'
      if (output.email)
        issueParams.body += `\n\nContact: ${output.email}`
      break
    case 'idea':
      issueParams.title = 'Feature Idea'
      break
  }

  // Create issue in the repo
  const response = await octokit.issues.create(issueParams)

  return {
    success: true,
    issueUrl: response.data.html_url,
    issueNumber: response.data.number,
  } satisfies FeedbackResponse
})
