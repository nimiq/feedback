export default eventHandler(async (event) => {
  const { pathname = '' } = getRouterParams(event)

  // TODO improve security
  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')

  return hubBlob().serve(event, pathname)
})
