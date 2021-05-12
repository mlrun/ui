import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_FUNCTION_TEMPLATE_BEGIN,
  FETCH_FUNCTION_TEMPLATE_FAILURE,
  FETCH_FUNCTION_TEMPLATE_SUCCESS,
  REMOVE_FUNCTION_TEMPLATE,
  SET_FUNCTIONS_TEMPLATES,
  SET_NEW_FUNCTION_NAME,
  SET_NEW_FUNCTION_TAG,
  SET_NEW_FUNCTION_TYPE,
  SET_NEW_FUNCTION_DESCRIPTION,
  SET_NEW_FUNCTION_LABELS
} from '../constants'

const initialState = {
  functions: [],
  loading: false,
  error: null,
  newFunction: {
    kind: '',
    metadata: {
      labels: {},
      name: '',
      tag: ''
    },

    spec: {
      args: [],
      build: {
        commands: [],
        functionSourceCode: ''
      },
      default_handler: '',
      description: '',
      env: [],
      image: '',
      volume_mounts: [],
      volumes: []
    }
  },
  templatesCatalog: {},
  template: {}
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
        template: payload
      }
    case FETCH_FUNCTION_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: false,
        template: {},
        error: payload
      }
    case REMOVE_FUNCTION_TEMPLATE:
      return {
        ...state,
        template: {}
      }
    case SET_NEW_FUNCTION_DESCRIPTION:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            description: payload
          }
        }
      }
    case SET_NEW_FUNCTION_LABELS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          metadata: {
            ...state.newFunction.metadata,
            labels: payload
          }
        }
      }
    case SET_NEW_FUNCTION_NAME:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          metadata: {
            ...state.newFunction.metadata,
            name: payload
          }
        }
      }
    case SET_NEW_FUNCTION_TAG:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          metadata: {
            ...state.newFunction.metadata,
            tag: payload
          }
        }
      }
    case SET_NEW_FUNCTION_TYPE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          kind: payload
        }
      }
    default:
      return state
  }
}
