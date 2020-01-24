const initialState = {
  artifacts: [],
  isRefresh: false
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_ARTIFACTS':
      return {
        ...state,
        isReferesh: false,
        artifacts: payload.artifacts
      }
    case 'REFRESH_ARTIFACTS':
      return {
        ...state,
        isRefresh: payload
      }
    default:
      return state
  }
}
