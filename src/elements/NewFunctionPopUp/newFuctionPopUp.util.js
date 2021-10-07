export const runtimeOptions = isDemo => [
  {
    id: 'job',
    label: 'Job'
  },
  {
    id: 'serving',
    label: 'Serving',
    hidden: !isDemo
  }
]

export const DEFAULT_RUNTIME = 'job'
