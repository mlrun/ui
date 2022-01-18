import {
  DATE_FILTER_ANY_TIME,
  GROUP_BY_NAME,
  REMOVE_FILTERS,
  SET_FILTER_PROJECT_OPTIONS,
  SET_FILTER_TAG_OPTIONS,
  SET_FILTERS,
  SHOW_ITERATIONS,
  STATE_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'

const initialState = {
  dates: {
    value: DATE_FILTER_ANY_TIME,
    isPredefined: false
  },
  groupBy: GROUP_BY_NAME,
  iter: SHOW_ITERATIONS,
  labels: '',
  name: '',
  project: '',
  showUntagged: '',
  state: STATE_FILTER_ALL_ITEMS,
  sortBy: '',
  tag: TAG_FILTER_LATEST,
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
