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
