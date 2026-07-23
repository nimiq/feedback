import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { ratingToEmoji } from './rating-to-emoji'

export interface CreateSlackMessageOptions {
  form: InferOutput<typeof FormSchema>
  github?: GitHubIssue
  linear?: LinearIssue
}

export async function createSlackMessage({ form: { app, type, rating, tags }, github, linear }: CreateSlackMessageOptions): Result<undefined> {
  const { webhookUrl } = useSafeRuntimeConfig().slack

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

  text += github
    ? `GitHub: ${github.issueUrl}\n`
    : '⚠️ GitHub issue could not be created\n'

  if (linear)
    text += `Linear: ${linear.issueUrl}`

  const payload = { text }
  try {
    await $fetch(webhookUrl, { method: 'POST', body: payload })
  }
  catch {
    return [false, 'Slack request failed', undefined]
  }
  return [true, undefined, undefined]
}
