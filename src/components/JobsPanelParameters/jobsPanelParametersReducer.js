import panelData from '../JobsPanel/panelData'

export const initialState = {
  addNewParameter: false,
  newParameter: {
    name: '',
    valueType: 'string',
    value: '',
    parameterType: panelData.newParameterType[0].id
  },
  selectedParameter: {}
}

export const parametersActions = {
  REMOVE_NEW_PARAMETER_DATA: 'REMOVE_NEW_PARAMETER_DATA',
  SET_ADD_NEW_PARAMETER: 'SET_ADD_NEW_PARAMETER',
  SET_NEW_PARAMETER_NAME: 'SET_NEW_PARAMETER_NAME',
  SET_NEW_PARAMETER_TYPE: 'SET_NEW_PARAMETER_TYPE',
  SET_NEW_PARAMETER_VALUE: 'SET_NEW_PARAMETER_VALUE',
  SET_NEW_PARAMETER_VALUE_TYPE: 'SET_NEW_PARAMETER_VALUE_TYPE',
  SET_SELECTED_PARAMETER: 'SET_SELECTED_PARAMETER'
}

export const jobsPanelParametersReducer = (state, { type, payload }) => {
  switch (type) {
    case parametersActions.REMOVE_NEW_PARAMETER_DATA:
      return {
        ...state,
        newParameter: {
          name: '',
          value: '',
          valueType: 'string',
          parameterType: panelData.newParameterType[0].id
        }
      }
    case parametersActions.SET_ADD_NEW_PARAMETER:
      return {
        ...state,
        addNewParameter: payload
      }
    case parametersActions.SET_NEW_PARAMETER_NAME:
      return {
        ...state,
        newParameter: {
          ...state.newParameter,
          name: payload
        }
      }
    case parametersActions.SET_NEW_PARAMETER_TYPE:
      return {
        ...state,
        newParameter: {
          ...state.newParameter,
          parameterType: payload
        }
      }
    case parametersActions.SET_NEW_PARAMETER_VALUE:
      return {
        ...state,
        newParameter: {
          ...state.newParameter,
          value: payload
        }
      }
    case parametersActions.SET_NEW_PARAMETER_VALUE_TYPE:
      return {
        ...state,
        newParameter: {
          ...state.newParameter,
          valueType: payload
        }
      }
    case parametersActions.SET_SELECTED_PARAMETER:
      return {
        ...state,
        selectedParameter: payload
      }
    default:
      return state
  }
}
