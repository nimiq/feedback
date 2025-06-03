import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { ratingToEmoji } from './rating-to-emoji'

export function submissionToMarkdown(id: string, form: InferOutput<typeof FormSchema>, filesUrl: string[] = [], logsUrl?: string | null): string {
  const { app, description, type, email, rating, logs } = form

  let markdown = `# ${app} - ${type}\n\n> ID: ${id}\n\n## Description\n\n${description.trim()}\n\n`
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
    markdown += `## Debug Logs\n\n[Download Debug Logs](${logsUrl})\n\n<details>\n<summary>Debug Information</summary>\n\n\`\`\`\n${logs}\n\`\`\`\n\n</details>\n\n`
  }

  return markdown
}
