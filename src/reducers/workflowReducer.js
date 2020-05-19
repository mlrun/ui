import {
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS
} from '../constants'

const initialState = {
  workflows: [],
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_WORKFLOWS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_WORKFLOWS_SUCCESS:
      return {
        ...state,
        workflows: payload,
        loading: false
      }
    case FETCH_WORKFLOWS_FAILURE:
      return {
        ...state,
        workflows: [],
        loading: false,
        error: payload
      }
    default:
      return state
  }
}
