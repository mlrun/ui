import {
  INIT_GROUP_FILTER,
  INIT_STATE_FILTER,
  INIT_TAG_FILTER,
  REMOVE_FILTERS,
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
  showUntagged: ''
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTERS:
      return {
        ...state,
        ...payload
      }
    case REMOVE_FILTERS:
      return initialState
    default:
      return state
  }
}
