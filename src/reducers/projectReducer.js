import {
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS
} from '../constants'

const initialState = {
  projects: [],
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PROJECTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: payload,
        loading: false
      }
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        loading: false,
        error: payload
      }
    default:
      return state
  }
}
