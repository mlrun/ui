import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  SET_FUNCTIONS_TEMPLATES
} from '../constants'

const initialState = {
  functions: [],
  loading: false,
  error: null,
  templates: []
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
    case SET_FUNCTIONS_TEMPLATES:
      return {
        ...state,
        templates: payload
      }
    default:
      return state
  }
}
