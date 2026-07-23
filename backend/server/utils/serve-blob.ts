import { blob } from 'hub:blob'

export function serveBlob(event: Parameters<typeof getRouterParams>[0]) {
  const { pathname = '' } = getRouterParams(event)
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  return blob.serve(event, pathname)
}
