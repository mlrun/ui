/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import panelData from '../JobsPanel/panelData'

export const initialState = {
  addNewParameter: false,
  newParameter: {
    name: '',
    valueType: 'str',
    parameterType: panelData.newParameterType[0].id,
    value: ''
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
        newParameter: { ...initialState.newParameter }
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
