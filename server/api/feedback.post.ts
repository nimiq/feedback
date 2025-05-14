import { Octokit } from '@octokit/rest'
import { object, string, number, minValue, maxValue, safeParse, pipe } from 'valibot'

// Define validation schema for feedback input
const FeedbackSchema = object({
  rating: pipe(
    number('Rating must be a number'),
    minValue(0, 'Rating must be at least 0'),
    maxValue(5, 'Rating cannot exceed 5'),
  ),
  description: string('Description must be a string'),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    // Validate input using valibot
    const { output, issues } = safeParse(FeedbackSchema, body)
    if (issues) {
      return createError({ 
        statusCode: 400, 
        statusMessage: 'Invalid feedback data', 
        message: JSON.stringify(issues) 
      })
    }
    
    const { rating, description } = output
    const config = useRuntimeConfig()
    
    // Check if GitHub token exists
    if (!config.githubToken) {
      return createError({ statusCode: 500, message: 'GitHub token not configured' })
    }

    // Initialize Octokit with GitHub token
    const octokit = new Octokit({ auth: config.githubToken })

    // Create issue in the repo
    const response = await octokit.issues.create({
      owner: 'onmax',
      repo: 'nimiq-feedback',
      title: `Feedback: Rating ${rating}/5`,
      body: description,
      labels: ['feedback', `rating-${rating}`],
    })

    return {
      success: true,
      issueUrl: response.data.html_url,
      issueNumber: response.data.number,
    }
})
