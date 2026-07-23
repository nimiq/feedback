import type { InferOutput } from 'valibot'
import consola from 'consola'
import { blob } from 'hub:blob'

const leadingPathCharacters = /^[./\\]+/
const unsafeBlobCharacters = /[^\w.-]+/g
const leadingDots = /^\.+/

function sanitizeBlobSegment(value: string): string {
  return value
    .normalize('NFKC')
    .replace(leadingPathCharacters, '')
    .replace(unsafeBlobCharacters, '_')
    .replace(leadingDots, '')
    .slice(0, 160) || 'file'
}

function createBlobBaseUrl(path: 'images' | 'logs'): URL {
  const { productionUrl } = useSafeRuntimeConfig()
  try {
    return new URL(`/${path}/`, productionUrl)
  }
  catch (error) {
    consola.error(`Invalid production URL for ${path}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid production URL for ${path}`,
    })
  }
}

function createPublicBlobUrl(baseUrl: URL, pathname: string): string {
  const encodedPath = pathname.split('/').map(segment => encodeURIComponent(segment)).join('/')
  return new URL(encodedPath, baseUrl).toString()
}

export async function uploadFiles(id: string, { app, type, attachments }: InferOutput<typeof FormSchema>): Result<string[]> {
  const imagesUrl = createBlobBaseUrl('images')
  const safeApp = sanitizeBlobSegment(app)
  const promises = attachments.map(async (file) => {
    const name = `${safeApp}/${type}/${id}__${sanitizeBlobSegment(file.name)}`
    const hubFile = await blob.put(name, file)
    return {
      pathname: hubFile.pathname,
      url: createPublicBlobUrl(imagesUrl, hubFile.pathname),
    }
  })

  const results = await Promise.allSettled(promises)
  const errors = results.filter(result => result.status === 'rejected')
  const uploads = results.filter(result => result.status === 'fulfilled')
  if (errors.length > 0) {
    await Promise.allSettled(
      uploads.map(result => blob.del(result.value.pathname)),
    )
    return [false, JSON.stringify(errors), undefined] as const
  }

  return [true, undefined, uploads.map(result => result.value.url)] as const
}

export async function uploadLogs(id: string, { app, logs }: InferOutput<typeof FormSchema>): Result<string | undefined> {
  if (!logs)
    return [true, undefined, undefined] as const

  const logsUrl = createBlobBaseUrl('logs')

  try {
    const name = `${sanitizeBlobSegment(app)}/logs/${id}.txt`
    const logBlob = new Blob([logs], { type: 'text/plain' })
    const hubFile = await blob.put(name, logBlob)
    return [true, undefined, createPublicBlobUrl(logsUrl, hubFile.pathname)] as const
  }
  catch (error) {
    return [false, `Error uploading logs: ${JSON.stringify(error)}`, undefined] as const
  }
}
