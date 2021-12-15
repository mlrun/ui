export const isDemoMode = search => {
  return new URLSearchParams(search).get('demo')?.toLowerCase() === 'true'
}

export const calcIsDemoPrefix = (path, isDemoMode) => {
  let prefix = path.includes('?') ? '&' : '?'
  return isDemoMode ? prefix.concat('demo=true') : ''
}

export const isPanelOpened = search => {
  return new URLSearchParams(search).get('openPanel')?.toLowerCase() === 'true'
}
