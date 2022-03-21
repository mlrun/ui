export const isDemoMode = search => {
  return new URLSearchParams(search).get('demo')?.toLowerCase() === 'true'
}

export const isPanelOpened = search => {
  return new URLSearchParams(search).get('openPanel')?.toLowerCase() === 'true'
}

export const areNuclioStreamsEnabled = frontendSpec =>
  frontendSpec?.feature_flags?.nuclio_streams === 'enabled'
