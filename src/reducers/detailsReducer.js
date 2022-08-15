import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  REMOVE_JOB_PODS,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE,
  FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS,
  FETCH_MODEL_FEATURE_VECTOR_BEGIN,
  FETCH_MODEL_FEATURE_VECTOR_FAILURE,
  FETCH_MODEL_FEATURE_VECTOR_SUCCESS,
  REMOVE_MODEL_FEATURE_VECTOR,
  SET_CHANGES_COUNTER,
  SET_CHANGES,
  SET_CHANGES_DATA,
  SET_INFO_CONTENT,
  SET_ITERATION,
  SET_ITERATION_OPTIONS,
  SET_REFRESH_WAS_HANDLED,
  SHOW_WARNING,
  REMOVE_INFO_CONTENT,
  RESET_CHANGES
} from '../constants'

const initialState = {
  changes: {
    counter: 0,
    data: {}
  },
  error: null,
  infoContent: {},
  iteration: '',
  iterationOptions: [],
  loading: false,
  modelEndpoint: {
    data: {}
  },
  modelFeatureVectorData: {},
  pods: {
    podsList: [],
    podsPending: [],
    podsTooltip: []
  },
  refreshWasHandled: false,
  showWarning: false
}

const detailsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOB_PODS_SUCCESS:
      return {
        ...state,
        error: null,
        pods: {
          ...payload
        }
      }
    case FETCH_JOB_PODS_FAILURE:
      return {
        ...state,
        error: payload,
        pods: {
          ...initialState.pods
        }
      }
    case FETCH_MODEL_FEATURE_VECTOR_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODEL_FEATURE_VECTOR_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        modelFeatureVectorData: {
          ...payload
        }
      }
    case FETCH_MODEL_FEATURE_VECTOR_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        modelFeatureVectorData: {
          ...initialState.modelFeatureVectorData
        }
      }
    case REMOVE_MODEL_FEATURE_VECTOR:
      return {
        ...state,
        modelFeatureVectorData: initialState.modelFeatureVectorData
      }
    case REMOVE_JOB_PODS:
      return {
        ...state,
        pods: initialState.pods
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
        modelEndpoint: {
          data: {}
        }
      }
    case FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        modelEndpoint: {
          data: payload
        }
      }
    case REMOVE_INFO_CONTENT:
      return {
        ...state,
        infoContent: {}
      }
    case RESET_CHANGES:
      return {
        ...state,
        changes: initialState.changes
      }
    case SET_CHANGES_COUNTER:
      return {
        ...state,
        changes: {
          ...state.changes,
          counter: payload
        }
      }
    case SET_CHANGES:
      return {
        ...state,
        changes: payload
      }
    case SET_CHANGES_DATA:
      return {
        ...state,
        changes: {
          ...state.changes,
          data: payload
        }
      }
    case SET_INFO_CONTENT:
      return {
        ...state,
        infoContent: payload
      }
    case SET_ITERATION:
      return {
        ...state,
        iteration: payload
      }
    case SET_ITERATION_OPTIONS:
      return {
        ...state,
        iterationOptions: payload
      }
    case SET_REFRESH_WAS_HANDLED:
      return {
        ...state,
        refreshWasHandled: payload
      }
    case SHOW_WARNING:
      return {
        ...state,
        showWarning: payload
      }
    default:
      return state
  }
}

export default detailsReducer
