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
