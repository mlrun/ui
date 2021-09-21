export const isDemoMode = search => {
  return new URLSearchParams(search).get('demo') === 'true'
}
