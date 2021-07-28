import { FUNCTIONS_PAGE } from '../constants'

const getState = (state, page) => {
  if (page === FUNCTIONS_PAGE) {
    return {
      value: state || 'empty',
      label: state ? functionStateLabels[state] : 'Created'
    }
  } else {
    return {
      value: state ?? null,
      label: state ? commonStateLabels[state] : ''
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
  running: 'Deploying'
}

export default getState
