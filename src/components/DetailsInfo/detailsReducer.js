export const initialState = {
  iteration: '0',
  iterationOptions: {
    label: 'Main',
    id: '0'
  },
  changes: {
    counter: 0,
    data: {}
  },
  infoContent: {},
  showWarning: false
}

export const detailsActions = {
  REMOVE_INFO_CONTENT: 'REMOVE_INFO_CONTENT',
  RESET_CHANGES: 'RESET_CHANGES',
  SET_CHANGES_COUNTER: 'SET_CHANGES_COUNTER',
  SET_CHANGES_DATA: 'SET_CHANGES_DATA',
  SET_ITERATION: 'SET_ITERATION',
  SET_INFO_CONTENT: 'SET_INFO_CONTENT',
  SHOW_WARNING: 'SHOW_WARNING'
}

export const detailsReducer = (state, { type, payload }) => {
  switch (type) {
    case detailsActions.REMOVE_INFO_CONTENT:
      return {
        ...state,
        infoContent: {}
      }
    case detailsActions.RESET_CHANGES:
      return {
        ...state,
        changes: {
          counter: 0,
          data: {}
        }
      }
    case detailsActions.SET_CHANGES_COUNTER:
      return {
        ...state,
        changes: {
          ...state.changes,
          counter: payload
        }
      }
    case detailsActions.SET_CHANGES_DATA:
      return {
        ...state,
        changes: {
          ...state.changes,
          data: payload
        }
      }
    case detailsActions.SET_INFO_CONTENT:
      return {
        ...state,
        infoContent: payload
      }
    case detailsActions.SET_ITERATION:
      return {
        ...state,
        iteration: payload
      }
    case detailsActions.SHOW_WARNING:
      return {
        ...state,
        showWarning: payload
      }
    default:
      return state
  }
}
