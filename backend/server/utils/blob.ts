import type { InferOutput } from 'valibot'

export async function uploadFiles(id: string, { app, type, attachments }: InferOutput<typeof FormSchema>): Result<string[]> {
  const { productionUrl } = useRuntimeConfig()
  const imagesUrl = new URL('/images/', productionUrl)

  const filesUrls: string[] = []
  const promises = attachments.map(async (file) => {
    const name = encodeURI(`${app}/${type}/${id}__${file.name}`)
    const hubFile = await hubBlob().put(name, file)
    filesUrls.push(new URL(`./${hubFile.pathname}`, imagesUrl).toString())
  })

  const results = await Promise.allSettled(promises)
  const errors = results.filter(result => result.status === 'rejected')
  if (errors.length > 0)
    return [false, JSON.stringify(errors), undefined] as const

  return [true, undefined, filesUrls] as const
}

export async function uploadLogs(id: string, { app, logs }: InferOutput<typeof FormSchema>): Result<string | null> {
  if (!logs) {
    return [true, undefined, null] as const
  }

  const { productionUrl } = useRuntimeConfig()
  const imagesUrl = new URL('/images/', productionUrl)

  try {
    const name = encodeURI(`${app}/logs/${id}.txt`)
    const logBlob = new Blob([logs], { type: 'text/plain' })
    const hubFile = await hubBlob().put(name, logBlob)
    const logUrl = new URL(`./${hubFile.pathname}`, imagesUrl).toString()

    return [true, undefined, logUrl] as const
  }
  catch (error) {
    return [false, `Error uploading logs: ${JSON.stringify(error)}`, undefined] as const
  }
}
