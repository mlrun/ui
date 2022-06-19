import { FUNCTIONS_PAGE } from '../constants'

const getState = (state, page, kind) => {
  if (page === FUNCTIONS_PAGE) {
    return {
      value: state || 'created',
      label: state ? functionStateLabels[state] : 'Created',
      className: `state-${state || 'created'}${kind ? '-' + kind : ''}`
    }
  } else {
    return {
      value: state ?? null,
      label: state ? commonStateLabels[state] : '',
      className: `state-${state ?? ''}${kind ? '-' + kind : ''}`
    }
  }
}

const commonStateLabels = {
  aborted: 'Aborted',
  active: 'Active',
  completed: 'Completed',
  created: 'Created',
  error: 'Error',
  fail: 'Error',
  failed: 'Error',
  pending: 'Pending',
  ready: 'Ready',
  running: 'Running',
  succeeded: 'Completed'
}

const functionStateLabels = {
  build: 'Deploying',
  deploying: 'Deploying',
  error: 'Error',
  failed: 'Error',
  pending: 'Deploying',
  ready: 'Ready',
  running: 'Running',
  succeeded: 'Succeeded'
}

export default getState
