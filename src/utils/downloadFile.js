export default (file, response) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([response.data]))
  link.download = file
  link.click()
  link.remove()
}
