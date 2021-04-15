import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  REMOVE_JOB_PODS,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS
} from '../constants'

const initialState = {
  pods: {
    podsList: [],
    podsPending: [],
    podsTooltip: [],
    error: null
  },
  modelEndpoint: {
    data: {},
    error: null,
    loading: false
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
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN:
      return {
        ...state,
        modelEndpoint: {
          ...state.modelEndpoint,
          loading: true
        }
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE:
      return {
        ...state,
        modelEndpoint: {
          data: {},
          error: payload,
          loading: false
        }
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS:
      return {
        ...state,
        modelEndpoint: {
          error: null,
          data: { ...payload },
          loading: false
        }
      }
    default:
      return state
  }
}
