import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'

export function submissionToMarkdown(id: string, form: InferOutput<typeof FormSchema>) {
  const { app, description, type, email, rating, attachments } = form

  let markdown = `# ${app} - ${type}\n\n> ID: ${id}\n\n## Description\n\n${description.trim()}\n\n`
  if (email)
    markdown += `## Contact\n\n${email}\n\n`
  if (rating !== null)
    markdown += `## Rating\n\n${rating}\n\n`
  if (attachments && attachments.length > 0) {
    markdown += `## Attachments\n\n`
    attachments.forEach((url, i) => {
      markdown += `![Image for ${type}-${i}](${url})\n`
    })
  }

  return markdown
}
