import {
  FETCH_NUCLIO_FUNCTIONS_BEGIN,
  FETCH_NUCLIO_FUNCTIONS_FAILURE,
  FETCH_NUCLIO_FUNCTIONS_SUCCESS
} from '../constants'

const initialState = {
  functions: [],
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
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
        functions: payload,
        loading: false,
        error: null
      }
    default:
      return state
  }
}
