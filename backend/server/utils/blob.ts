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
