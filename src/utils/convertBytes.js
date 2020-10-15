export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const kilobytes = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const sizesIndex = Math.floor(Math.log(bytes) / Math.log(kilobytes))

  return (
    parseFloat((bytes / Math.pow(kilobytes, sizesIndex)).toFixed(dm)) +
    ' ' +
    sizes[sizesIndex]
  )
}
