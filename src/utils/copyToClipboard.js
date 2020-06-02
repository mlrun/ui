export const copyToClipboard = str => {
  const textArea = document.createElement('textarea')
  textArea.value = str

  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}
