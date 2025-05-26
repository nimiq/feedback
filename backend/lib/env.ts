import process from 'node:process'
import { object, optional, safeParse, string } from 'valibot'

const EnvSchema = object({
  NUXT_GITHUB_OWNER: string(),
  NUXT_GITHUB_REPO: string(),
  NUXT_GITHUB_TOKEN: string(),
  NUXT_PRODUCTION_URL: string(),
  NUXT_SLACK_WEBHOOK_URL: optional(string()),
})

// Function to validate environment variables
function tryParseEnv(schema: any, buildEnv: Record<string, string | undefined> = process.env) {
  const result = safeParse(schema, buildEnv)

  if (!result.success) {
    let message = 'Missing required values in .env:\n'
    result.issues.forEach((issue: any) => {
      message += `${issue.path?.[0]?.key || 'unknown'}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  return result.output
}

// Check if all required environment variables are present
export const validateEnv = () => tryParseEnv(EnvSchema)
