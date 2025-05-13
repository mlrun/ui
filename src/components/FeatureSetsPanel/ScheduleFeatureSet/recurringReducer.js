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
  SCHEDULE_REPEAT_END_ACTIVE_OPTION: 'SCHEDULE_REPEAT_END_ACTIVE_OPTION',
  SCHEDULE_REPEAT_END_DATE: 'SCHEDULE_REPEAT_END_DATE',
  SCHEDULE_REPEAT_DAY_TIME: 'SCHEDULE_REPEAT_DAY_TIME',
  SCHEDULE_REPEAT_MONTH_TIME: 'SCHEDULE_REPEAT_MONTH_TIME',
  SCHEDULE_REPEAT_END_OCCURRENCES: 'SCHEDULE_REPEAT_END_OCCURRENCES',
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
