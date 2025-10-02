import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { ratingToEmoji } from './rating-to-emoji'

export interface CreateSlackMessageOptions {
  form: InferOutput<typeof FormSchema>
  github?: GitHubIssue
}

export async function createSlackMessage({ form: { app, type, rating, tags }, github }: CreateSlackMessageOptions): Result<undefined> {
  const { webhookUrl } = useRuntimeConfig().slack

  if (!webhookUrl) {
    return [false, 'Slack webhook URL not configured', undefined]
  }

  const typeEmoji = { feedback: '💬', bug: '🐛', idea: '💡' }[type]
  const title = `${typeEmoji} [${app}] ${type.charAt(0).toUpperCase() + type.slice(1)}`

  // Create compact message
  let text = `${title}\n`

  if (type === 'feedback' && rating) {
    text += `Rating: ${ratingToEmoji(rating)}\n`
  }

  if (tags && tags.length > 0) {
    text += `Tags: ${tags.join(', ')}\n`
  }

  if (github) {
    text += `GitHub: ${github.issueUrl}`
  }
  else {
    text += `⚠️ GitHub issue could not be created`
  }

  const payload = { text }
  try {
    await $fetch(webhookUrl, { method: 'POST', body: payload })
  }
  catch (error) {
    return [false, `Network error sending to Slack: ${JSON.stringify(error)}`, undefined]
  }
  return [true, undefined, undefined]
}
