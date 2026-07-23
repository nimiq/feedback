import { blob } from 'hub:blob'
import { beforeEach, expect, it, vi } from 'vitest'
import { uploadFiles } from './blob'

beforeEach(() => {
  blob.del.mockReset()
  blob.put.mockReset()
  vi.stubGlobal('useSafeRuntimeConfig', () => ({
    productionUrl: 'https://feedback.test',
  }))
})

it('creates retrievable URLs from unsafe app and file names', async () => {
  blob.put.mockImplementation(async (pathname: string) => ({ pathname }))
  const file = new File(['image'], 'screen#1?.png', { type: 'image/png' })

  const [ok, , urls] = await uploadFiles('submission-id', {
    app: '../wallet?draft',
    attachments: [file],
    type: 'bug',
  } as never)

  expect(ok).toBe(true)
  expect(urls).toHaveLength(1)
  const url = new URL(urls![0])
  expect(url.search).toBe('')
  expect(url.hash).toBe('')
  expect(url.pathname).toContain('/images/wallet_draft/bug/submission-id__screen_1_.png')
})

it('deletes successful uploads when another upload fails', async () => {
  blob.put
    .mockResolvedValueOnce({ pathname: 'wallet/bug/id__one.png' })
    .mockRejectedValueOnce(new Error('upload failed'))

  const result = await uploadFiles('id', {
    app: 'wallet',
    attachments: [
      new File(['one'], 'one.png', { type: 'image/png' }),
      new File(['two'], 'two.png', { type: 'image/png' }),
    ],
    type: 'bug',
  } as never)

  expect(result[0]).toBe(false)
  expect(blob.del).toHaveBeenCalledWith('wallet/bug/id__one.png')
})
