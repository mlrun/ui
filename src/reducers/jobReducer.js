const initialState = {
  jobs: [],
  selectedJob: {},
  logs: '',
  artifacts: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: payload
      }
    case 'SET_SELECTED_JOB':
      return {
        ...state,
        selectedJob: payload
      }
    case 'SET_JOB_LOGS':
      return {
        ...state,
        logs: payload
      }
    case 'SET_JOB_ARTIFACTS':
      return {
        ...state,
        artifacts: payload
      }
    default:
      return state
  }
}
