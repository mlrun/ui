export const runtimeOptions = isDemoMode => [
  {
    id: 'job',
    label: 'Job'
  },
  {
    id: 'serving',
    label: 'Serving',
    hidden: !isDemoMode
  }
]

export const DEFAULT_RUNTIME = 'job'
