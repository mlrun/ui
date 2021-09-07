import {
  INIT_GROUP_FILTER,
  INIT_STATE_FILTER,
  INIT_TAG_FILTER,
  REMOVE_FILTERS,
  SET_FILTER_TAG_OPTIONS,
  SET_FILTERS
} from '../constants'

const initialState = {
  dates: ['', ''],
  iter: 'iter',
  labels: '',
  name: '',
  groupBy: INIT_GROUP_FILTER,
  state: INIT_STATE_FILTER,
  tag: INIT_TAG_FILTER,
  tagOptions: [],
  showUntagged: ''
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
