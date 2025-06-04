export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  // pathname is an array for catch-all routes
  const pathString = Array.isArray(pathname) ? pathname.join('/') : pathname

  if (!pathString) {
    return createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const [firstPart] = pathString.split('/')
  if (!firstPart || (firstPart !== 'images' && firstPart !== 'logs'))
    return createError({ statusCode: 404, statusMessage: 'Not found' })

  // TODO improve security
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')

  return hubBlob().serve(event, pathString)
})
