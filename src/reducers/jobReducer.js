const initialState = {
  jobs: [],
  selectedJob: {},
  logs: '',
  jobsData: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: payload
      }
    case 'SET_JOBS_DATA':
      return {
        ...state,
        jobsData: payload
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
    case 'REMOVE_JOB_LOGS':
      return {
        ...state,
        logs: ''
      }
    default:
      return state
  }
}
