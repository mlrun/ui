export const initialState = {
  addNewSecret: false,
  newSecret: {
    kind: 'file',
    source: ''
  },
  selectedSecret: {}
}

export const advancedActions = {
  REMOVE_NEW_SECRET_DATA: 'REMOVE_NEW_SECRET_DATA',
  SET_ADD_NEW_SECRET: 'SET_ADD_NEW_SECRET',
  SET_NEW_SECRET_KIND: 'SET_NEW_SECRET_NAME',
  SET_NEW_SECRET_SOURCE: 'SET_NEW_SECRET_SOURCE',
  SET_SELECTED_SECRET: 'SET_SELECTED_SECRET'
}

export const jobsPanelAdvancedReducer = (state, { type, payload }) => {
  switch (type) {
    case advancedActions.REMOVE_NEW_SECRET_DATA:
      return {
        ...state,
        newSecret: {
          kind: 'file',
          source: ''
        }
      }

    case advancedActions.SET_ADD_NEW_SECRET:
      return {
        ...state,
        addNewSecret: payload
      }

    case advancedActions.SET_NEW_SECRET_KIND:
      return {
        ...state,
        newSecret: {
          ...state.newSecret,
          kind: payload
        }
      }

    case advancedActions.SET_NEW_SECRET_SOURCE:
      return {
        ...state,
        newSecret: {
          ...state.newSecret,
          source: payload
        }
      }

    case advancedActions.SET_SELECTED_SECRET:
      return {
        ...state,
        selectedSecret: payload
      }
    default:
      return state
  }
}
