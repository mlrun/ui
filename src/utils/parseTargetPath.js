export default targetPath => {
  if (!targetPath) {
    return {
      schema: '',
      path: ''
    }
  }

  return {
    schema: targetPath.includes('://')
      ? targetPath.replace(/:\/\/.*$/g, '')
      : '',
    path: targetPath.replace(/.*:\/\//g, '')
  }
}
