export const initialState = {
  scheduleRepeat: {
    activeOption: 'minute',
    minute: 10,
    hour: 1,
    week: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      time: '00:00'
    },
    day: {
      time: '00:00'
    },
    month: {
      time: '00:00'
    }
  },
  scheduleRepeatEnd: {
    activeOption: 'never',
    occurrences: '1',
    date: ''
  }
}

export const scheduleActionType = {
  SCHEDULE_REPEAT_ACTIVE_OPTION: 'SCHEDULE_REPEAT_ACTIVE_OPTION',
  SCHEDULE_REPEAT_DAY: 'SCHEDULE_REPEAT_DAY',
  SCHEDULE_REPEAT_DAYS_OF_WEEK: 'SCHEDULE_REPEAT_DAYS_OF_WEEK',
  SCHEDULE_REPEAT_DAY_TIME: 'SCHEDULE_REPEAT_DAY_TIME',
  SCHEDULE_REPEAT_MONTH_TIME: 'SCHEDULE_REPEAT_MONTH_TIME',
  SCHEDULE_REPEAT_HOUR: 'SCHEDULE_REPEAT_HOUR',
  SCHEDULE_REPEAT_MINUTE: 'SCHEDULE_REPEAT_MINUTE',
  SCHEDULE_REPEAT_WEEK_TIME: 'SCHEDULE_REPEAT_WEEK_TIME'
}

export const recurringReducer = (state, action) => {
  switch (action.type) {
    case scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          activeOption: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_MINUTE:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          minute: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_HOUR:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          hour: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_DAY:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          day: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_DAY_TIME:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          day: {
            time: action.payload
          }
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK: {
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          week: {
            ...state.scheduleRepeat.week,
            days: action.payload
          }
        }
      }
    }
    case scheduleActionType.SCHEDULE_REPEAT_WEEK_TIME:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          week: {
            ...state.scheduleRepeat.week,
            time: action.payload
          }
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_MONTH_TIME:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          month: {
            time: action.payload
          }
        }
      }
    default:
      return state
  }
}
