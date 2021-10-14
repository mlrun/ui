import {
  INIT_GROUP_FILTER,
  INIT_STATE_FILTER,
  INIT_TAG_FILTER,
  REMOVE_FILTERS,
  SET_FILTER_TAG_OPTIONS,
  SET_FILTERS
} from '../constants'

const initialState = {
  dates: {
    value: ['', ''],
    isPredefined: false
  },
  groupBy: INIT_GROUP_FILTER,
  iter: 'iter',
  labels: '',
  name: '',
  showUntagged: '',
  state: INIT_STATE_FILTER,
  sortBy: '',
  tag: INIT_TAG_FILTER,
  tagOptions: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTERS:
      return {
        ...state,
        ...payload
      }
    case SET_FILTER_TAG_OPTIONS:
      return {
        ...state,
        tagOptions: payload
      }
    case REMOVE_FILTERS:
      return initialState
    default:
      return state
  }
}
