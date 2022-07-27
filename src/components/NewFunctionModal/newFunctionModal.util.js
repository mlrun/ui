import { FUNCTION_TYPE_JOB } from '../../constants'

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

export const getModalTitle = runtime => {
  if (runtime === FUNCTION_TYPE_JOB) {
    return 'Create New Function'
  } else {
    return 'Deploy serving function'
  }
}
