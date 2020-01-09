const initialState = {
  jobs: [],
  selectedJob: {}
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
    default:
      return state
  }
}
