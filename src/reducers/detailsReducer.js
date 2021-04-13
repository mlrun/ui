import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  REMOVE_JOB_PODS
} from '../constants'

const initialState = {
  pods: {
    podsList: [],
    podsPending: [],
    podsTooltip: [],
    error: null
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOB_PODS_SUCCESS:
      return {
        ...state,
        pods: {
          ...payload,
          error: null
        }
      }
    case FETCH_JOB_PODS_FAILURE:
      return {
        ...state,
        pods: {
          ...initialState.pods,
          error: payload
        }
      }
    case REMOVE_JOB_PODS:
      return {
        ...state,
        pods: initialState.pods
      }
    default:
      return state
  }
}
