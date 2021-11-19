import {
  INIT_GROUP_FILTER,
  INIT_STATE_FILTER,
  INIT_TAG_FILTER,
  REMOVE_FILTERS,
  SET_FILTER_PROJECT_OPTIONS,
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
  project: '',
  showUntagged: '',
  state: INIT_STATE_FILTER,
  sortBy: '',
  tag: INIT_TAG_FILTER,
  tagOptions: [],
  projectOptions: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case REMOVE_FILTERS:
      return initialState
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
    case SET_FILTER_PROJECT_OPTIONS:
      return {
        ...state,
        projectOptions: payload
      }
    default:
      return state
  }
}
