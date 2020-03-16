import {
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS
} from '../constants'

const initialState = {
  jobs: [],
  logs: '',
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOBS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: payload,
        loading: false
      }
    case FETCH_JOBS_FAILURE:
      return {
        ...state,
        jobs: [],
        loading: false,
        error: payload
      }
    case 'SET_JOB_LOGS':
      return {
        ...state,
        logs: payload
      }
    default:
      return state
  }
}
