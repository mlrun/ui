const initialState = {
  artifacts: [],
  selectArtifact: {
    isPreview: false,
    item: {}
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_ARTIFACTS':
      return {
        ...state,
        artifacts: payload.artifacts
      }
    case 'SELECT_ARTIFACT':
      return {
        ...state,
        selectArtifact: payload
      }
    case 'REMOVE_SELECT_ARTIFACT':
      return {
        ...state,
        selectArtifact: {
          isPreview: false,
          item: {}
        }
      }
    default:
      return state
  }
}
