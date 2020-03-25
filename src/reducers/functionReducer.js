import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  SELECTED_FUNCTION,
  REMOVE_SELECTED_FUNCTION
} from '../constants'

const initialState = {
  functions: [],
  function: {},
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FUNCTIONS_SUCCESS:
      return {
        ...state,
        functions: payload,
        loading: false
      }
    case FETCH_FUNCTIONS_FAILURE:
      return {
        ...state,
        functions: [],
        loading: false,
        error: payload
      }
    case SELECTED_FUNCTION:
      return {
        ...state,
        function: payload
      }
    case REMOVE_SELECTED_FUNCTION:
      return {
        ...state,
        function: {}
      }
    default:
      return state
  }
}
