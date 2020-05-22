import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_FUNCTION_TEMPLATE_BEGIN,
  FETCH_FUNCTION_TEMPLATE_FAILURE,
  FETCH_FUNCTION_TEMPLATE_SUCCESS,
  REMOVE_FUNCTION_TEMPLATE,
  SET_FUNCTIONS_TEMPLATES
} from '../constants'

const initialState = {
  functions: [],
  loading: false,
  error: null,
  templatesCatalog: [],
  selectedFunction: {}
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
    case FETCH_FUNCTION_TEMPLATE_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FUNCTION_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedFunction: payload
      }
    case FETCH_FUNCTION_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: false,
        selectedFunction: {},
        error: payload
      }
    case REMOVE_FUNCTION_TEMPLATE:
      return {
        ...state,
        selectedFunction: {}
      }
    default:
      return state
  }
}
