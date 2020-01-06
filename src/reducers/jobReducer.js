const initialState = {
  jobs: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: payload
      }
    default:
      return state
  }
}
