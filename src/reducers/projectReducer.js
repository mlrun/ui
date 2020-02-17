const initialState = {
  projects: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: payload
      }
    default:
      return state
  }
}
