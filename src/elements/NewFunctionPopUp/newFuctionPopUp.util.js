export const runtimeOptions = isStagingMode => [
  {
    id: 'job',
    label: 'Job'
  },
  {
    id: 'serving',
    label: 'Serving',
    hidden: !isStagingMode
  }
]

export const DEFAULT_RUNTIME = 'job'
