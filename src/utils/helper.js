export const isDemoMode = search => {
  return new URLSearchParams(search).get('demo')?.toLowerCase() === 'true'
}
