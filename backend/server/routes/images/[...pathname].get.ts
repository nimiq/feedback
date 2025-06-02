export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  if (!pathname)
    return createError({ statusCode: 404, statusMessage: 'Not found' })

  // TODO improve security
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')

  return hubBlob().serve(event, pathname)
})
