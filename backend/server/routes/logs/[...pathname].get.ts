import { blob } from 'hub:blob'

export default eventHandler(async (event) => {
  const { pathname = '' } = getRouterParams(event)

  // TODO improve security
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')

  return blob.serve(event, pathname)
})
