const initialState = {
  artifacts: [],
  selectArtifact: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_ARTIFACTS':
      return {
        ...state,
        artifacts: payload.artifacts,
        selectArtifact: {}
      }
    case 'SELECT_ARTIFACT':
      return {
        ...state,
        selectArtifact: payload
      }
    default:
      return state
  }
}
