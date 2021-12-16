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
  broken: 'Broken',
  completed: 'Completed',
  created: 'Created',
  error: 'Error',
  fail: 'Fail',
  failed: 'Error',
  info: 'Info',
  pending: 'Pending',
  ready: 'Ready',
  running: 'Deploying',
  succeeded: 'Succeeded',
  warn: 'Warn'
}

const functionStateLabels = {
  build: 'Deploying',
  deploying: 'Deploying',
  error: 'Error',
  failed: 'Error',
  pending: 'Deploying',
  ready: 'Ready',
  running: 'Deploying',
  succeeded: 'Succeeded'
}

export default getState
