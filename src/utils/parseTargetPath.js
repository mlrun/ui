export default targetPath => {
  const index = targetPath.indexOf('://')
  const target_path = {
    schema: targetPath.includes('://') ? targetPath.slice(0, index) : '',
    path: targetPath.includes('://')
      ? targetPath.slice(index + '://'.length)
      : targetPath
  }
  return target_path
}
