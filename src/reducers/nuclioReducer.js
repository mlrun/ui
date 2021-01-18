import {
  FETCH_API_GATEWAYS_BEGIN,
  FETCH_API_GATEWAYS_FAILURE,
  FETCH_API_GATEWAYS_SUCCESS,
  FETCH_NUCLIO_FUNCTIONS_BEGIN,
  FETCH_NUCLIO_FUNCTIONS_FAILURE,
  FETCH_NUCLIO_FUNCTIONS_SUCCESS,
  FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS
} from '../constants'

const initialState = {
  apiGateways: 0,
  functions: {},
  currentProjectFunctions: [],
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_API_GATEWAYS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_API_GATEWAYS_FAILURE:
      return {
        ...state,
        apiGateways: 0,
        error: payload,
        loading: false
      }
    case FETCH_API_GATEWAYS_SUCCESS:
      return {
        ...state,
        apiGateways: payload,
        loading: false
      }
    case FETCH_NUCLIO_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_NUCLIO_FUNCTIONS_FAILURE:
      return {
        ...state,
        functions: [],
        loading: false,
        error: payload
      }
    case FETCH_NUCLIO_FUNCTIONS_SUCCESS:
      return {
        ...state,
        currentProjectFunctions: payload,
        loading: false,
        error: null
      }
    case FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS:
      return {
        ...state,
        functions: payload,
        loading: false,
        error: null
      }
    default:
      return state
  }
}
