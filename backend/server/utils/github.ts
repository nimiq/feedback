import type { RestEndpointMethodTypes } from '@octokit/rest'
import { Octokit } from '@octokit/rest'

export interface CreateGitHubIssueOptions {
  title: string
  markdown: string
  labels: string[]
}

type Issue = RestEndpointMethodTypes['issues']['create']['parameters']

export async function createGitHubIssue({ title, markdown: body, labels }: CreateGitHubIssueOptions) {
  const config = useRuntimeConfig()

  // Check if GitHub token exists
  if (!config.githubToken)
    throw createError({ statusCode: 500, message: 'GitHub token not configured' })
  const octokit = new Octokit({ auth: config.githubToken })

  const owner = 'onmax'
  const repo = 'nimiq-feedback'
  const issueParams: Issue = { title, body, owner, repo, labels }

  const response = await octokit.issues.create(issueParams)
  if (response.status !== 201)
    throw createError({ statusCode: 500, message: 'Error creating issue on GitHub' })

  return { issueUrl: response.data.url, issueNumber: response.data.number } satisfies FeedbackResponse['github']
}
