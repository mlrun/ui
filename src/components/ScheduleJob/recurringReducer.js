export const initialState = {
  scheduleRepeat: {
    activeOption: 'minute',
    minute: 1,
    hour: 1,
    day: 1,
    week: {
      daysOfTheWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      repeat: 1
    },
    month: 12
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
  SCHEDULE_REPEAT_END_ACTIVE_OPTION: 'SCHEDULE_REPEAT_END_ACTIVE_OPTION',
  SCHEDULE_REPEAT_END_DATE: 'SCHEDULE_REPEAT_END_DATE',
  SCHEDULE_REPEAT_END_OCCURRENCES: 'SCHEDULE_REPEAT_END_OCCURRENCES',
  SCHEDULE_REPEAT_HOUR: 'SCHEDULE_REPEAT_HOUR',
  SCHEDULE_REPEAT_MINUTE: 'SCHEDULE_REPEAT_MINUTE',
  SCHEDULE_REPEAT_MONTH: 'SCHEDULE_REPEAT_MONTH',
  SCHEDULE_REPEAT_WEEK: 'SCHEDULE_REPEAT_WEEK'
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
    case scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK: {
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          week: {
            ...state.scheduleRepeat.week,
            daysOfTheWeek: action.payload
          }
        }
      }
    }
    case scheduleActionType.SCHEDULE_REPEAT_WEEK:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          week: {
            ...state.scheduleRepeat.week,
            repeat: action.payload
          }
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_MONTH:
      return {
        ...state,
        scheduleRepeat: {
          ...state.scheduleRepeat,
          month: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_END_ACTIVE_OPTION:
      return {
        ...state,
        scheduleRepeatEnd: {
          ...state.scheduleRepeatEnd,
          activeOption: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_END_OCCURRENCES:
      return {
        ...state,
        scheduleRepeatEnd: {
          ...state.scheduleRepeatEnd,
          occurrences: action.payload
        }
      }
    case scheduleActionType.SCHEDULE_REPEAT_END_DATE:
      return {
        ...state,
        scheduleRepeatEnd: {
          ...state.scheduleRepeatEnd,
          date: action.payload
        }
      }
    default:
      return state
  }
}
