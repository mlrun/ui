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
  configFrom: {
    id: 'configFrom',
    label: 'From:',
    date: '',
    selectedDate: '',
    visibleDate: '',
    calendar: {},
    time: '',
    selectedTime: ''
  },
  configTo: {
    id: 'configTo',
    label: 'To:',
    date: '',
    selectedDate: '',
    visibleDate: '',
    calendar: {},
    time: '',
    selectedTime: ''
  }
}

export const datePickerActions = {
  UPDATE_DATE_FROM: 'UPDATE_DATE_FROM',
  UPDATE_SELECTED_DATE_FROM: 'UPDATE_SELECTED_DATE_FROM',
  UPDATE_VISIBLE_DATE_FROM: 'UPDATE_VISIBLE_DATE_FROM',
  UPDATE_CALENDAR_FROM: 'UPDATE_CALENDAR_FROM',
  UPDATE_DATE_TO: 'UPDATE_DATE_TO',
  UPDATE_SELECTED_DATE_TO: 'UPDATE_SELECTED_DATE_TO',
  UPDATE_VISIBLE_DATE_TO: 'UPDATE_VISIBLE_DATE_TO',
  UPDATE_CALENDAR_TO: 'UPDATE_CALENDAR_TO'
}

export const datePickerReducer = (state, { type, payload }) => {
  switch (type) {
    case datePickerActions.UPDATE_DATE_FROM:
      return {
        ...state,
        configFrom: {
          ...state.configFrom,
          date: payload,
          selectedDate: payload,
          visibleDate: payload
        }
      }
    case datePickerActions.UPDATE_SELECTED_DATE_FROM:
      return {
        ...state,
        configFrom: {
          ...state.configFrom,
          selectedDate: payload
        }
      }
    case datePickerActions.UPDATE_VISIBLE_DATE_FROM:
      return {
        ...state,
        configFrom: {
          ...state.configFrom,
          visibleDate: payload
        }
      }
    case datePickerActions.UPDATE_CALENDAR_FROM:
      return {
        ...state,
        configFrom: {
          ...state.configFrom,
          calendar: payload
        }
      }
    case datePickerActions.UPDATE_DATE_TO:
      return {
        ...state,
        configTo: {
          ...state.configTo,
          date: payload,
          selectedDate: payload,
          visibleDate: payload
        }
      }
    case datePickerActions.UPDATE_SELECTED_DATE_TO:
      return {
        ...state,
        configTo: {
          ...state.configTo,
          selectedDate: payload
        }
      }
    case datePickerActions.UPDATE_VISIBLE_DATE_TO:
      return {
        ...state,
        configTo: {
          ...state.configTo,
          visibleDate: payload
        }
      }
    case datePickerActions.UPDATE_CALENDAR_TO:
      return {
        ...state,
        configTo: {
          ...state.configTo,
          calendar: payload
        }
      }
    default:
      return state
  }
}
