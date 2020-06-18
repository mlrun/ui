export const initialState = {
  addNewEnvironmentVariable: false,
  addNewSecret: false,
  newEnvironmentVariable: {
    name: '',
    value: ''
  },
  newSecret: {
    kind: '',
    value: ''
  },
  selectedEnvironmentVariable: {},
  selectedSecret: {}
}

export const advancedActions = {
  REMOVE_NEW_ENVIRONMENT_VARIABLE_DATA: 'REMOVE_NEW_ENVIRONMENT_VARIABLE_DATA',
  REMOVE_NEW_SECRET_DATA: 'REMOVE_NEW_SECRET_DATA',
  SET_ADD_NEW_ENVIRONMENT_VARIABLE: 'SET_ADD_NEW_ENVIRONMENT_VARIABLE',
  SET_ADD_NEW_SECRET: 'SET_ADD_NEW_SECRET',
  SET_NEW_ENVIRONMENT_VARIABLE_NAME: 'SET_NEW_ENVIRONMENT_VARIABLE_NAME',
  SET_NEW_SECRET_KIND: 'SET_NEW_SECRET_NAME',
  SET_NEW_ENVIRONMENT_VARIABLE_VALUE: 'SET_NEW_ENVIRONMENT_VARIABLE_VALUE',
  SET_NEW_SECRET_VALUE: 'SET_NEW_SECRET_VALUE',
  SET_SELECTED_ENVIRONMENT_VARIABLE: 'SET_SELECTED_ENVIRONMENT_VARIABLE',
  SET_SELECTED_SECRET: 'SET_SELECTED_SECRET'
}

export const jobsPanelAdvancedReducer = (state, { type, payload }) => {
  switch (type) {
    case advancedActions.REMOVE_NEW_ENVIRONMENT_VARIABLE_DATA:
      return {
        ...state,
        newEnvironmentVariable: {
          name: '',
          value: ''
        }
      }
    case advancedActions.REMOVE_NEW_SECRET_DATA:
      return {
        ...state,
        newSecret: {
          kind: '',
          value: ''
        }
      }
    case advancedActions.SET_ADD_NEW_ENVIRONMENT_VARIABLE:
      return {
        ...state,
        addNewEnvironmentVariable: payload
      }
    case advancedActions.SET_ADD_NEW_SECRET:
      return {
        ...state,
        addNewSecret: payload
      }
    case advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_NAME:
      return {
        ...state,
        newEnvironmentVariable: {
          ...state.newEnvironmentVariable,
          name: payload
        }
      }
    case advancedActions.SET_NEW_SECRET_KIND:
      return {
        ...state,
        newSecret: {
          ...state.newVolume,
          type: payload
        }
      }
    case advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_VALUE:
      return {
        ...state,
        newEnvironmentVariable: {
          ...state.newEnvironmentVariable,
          value: payload
        }
      }
    case advancedActions.SET_NEW_SECRET_VALUE:
      return {
        ...state,
        newSecret: {
          ...state.newSecret,
          value: payload
        }
      }
    case advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE:
      return {
        ...state,
        selectedEnvironmentVariable: payload
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
