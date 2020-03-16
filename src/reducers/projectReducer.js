const initialState = {
  projects: [],
  error: ''
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: payload
      }
    case 'PROJECTS_ERROR':
      return {
        ...state,
        error: payload
      }
    default:
      return state
  }
}
