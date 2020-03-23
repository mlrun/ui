export const handleErrors = response => {
  if (response.statusText !== 'OK') {
    throw Error(response.statusText)
  }
  return response
}
