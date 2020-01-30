const initialState = {
  artifacts: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_ARTIFACTS':
      return {
        ...state,
        artifacts: payload.artifacts
      }
    default:
      return state
  }
}
