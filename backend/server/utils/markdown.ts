import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { ratingToEmoji } from './rating-to-emoji'

export function submissionToMarkdown(id: string, form: InferOutput<typeof FormSchema>, filesUrl: string[] = [], logsUrl?: string | undefined): string {
  const { app, description, type, email, rating, logs, tags } = form

  let markdown = `# ${app} - ${type}\n\n> ID: ${id}\n\n`
  if (tags && tags.length > 0)
    markdown += `🏷️ **Tags:** ${tags.join(', ')}\n\n`
  markdown += `## Description\n\n${description.trim()}\n\n`
  if (email)
    markdown += `✉️: ${email}\n\n`
  if (rating)
    markdown += `${ratingToEmoji(rating)}\n\n`
  if (filesUrl && filesUrl.length > 0) {
    markdown += `## Attachments\n\n`
    filesUrl.forEach((url, i) => {
      markdown += `![Image for ${type} - ${i}](${url}) \n`
    })
  }
  if (logs && logsUrl) {
    markdown += `## Debug Logs\n\n[Download Debug Logs](${logsUrl})\n\n`
  }

  return markdown
}
