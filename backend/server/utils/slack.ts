import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { ratingToEmoji } from './rating-to-emoji'

export interface CreateSlackMessageOptions {
  form: InferOutput<typeof FormSchema>
  markdown: string
  github: GitHubIssue
}

export async function createSlackMessage({ markdown, form: { app, type, rating }, github: { issueUrl } }: CreateSlackMessageOptions): Result<undefined> {
  const { webhookUrl } = useRuntimeConfig().slack

  if (!webhookUrl) {
    return [false, 'Slack webhook URL not configured', undefined]
  }

  const title = `[${app}] - ${{ feedback: 'Feedback', bug: 'Bug report', idea: 'Idea' }[type]}`

  // Create Slack blocks for rich formatting
  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: title } },
    { type: 'section', text: { type: 'mrkdwn', text: `<${issueUrl}|View GitHub Issue>` } },
    { type: 'section', text: { type: 'mrkdwn', text: markdown } },
  ]

  if (type === 'feedback' && rating)
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*Rating:* ${ratingToEmoji(rating)}` } })

  const payload = { blocks, text: title }
  try {
    await $fetch(webhookUrl, { method: 'POST', body: payload })
  }
  catch (error) {
    return [false, `Network error sending to Slack: ${JSON.stringify(error)}`, undefined]
  }
  return [true, undefined, undefined]
}
