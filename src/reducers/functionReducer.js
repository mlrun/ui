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
  SET_NEW_FUNCTION_LABELS,
  SET_NEW_FUNCTION_SOURCE_CODE,
  SET_NEW_FUNCTION_HANDLER,
  SET_NEW_FUNCTION_IMAGE,
  SET_NEW_FUNCTION_BASE_IMAGE,
  SET_NEW_FUNCTION_COMMANDS,
  SET_NEW_FUNCTION_VOLUME_MOUNTS,
  SET_NEW_FUNCTION_VOLUMES,
  SET_NEW_FUNCTION_RESOURCES,
  SET_NEW_FUNCTION_ENV,
  REMOVE_NEW_FUNCTION,
  CREATE_NEW_FUNCTION_BEGIN,
  CREATE_NEW_FUNCTION_FAILURE,
  CREATE_NEW_FUNCTION_SUCCESS,
  REMOVE_FUNCTIONS_ERROR,
  DEPLOY_FUNCTION_BEGIN,
  DEPLOY_FUNCTION_FAILURE,
  DEPLOY_FUNCTION_SUCCESS,
  SET_NEW_FUNCTION_SECRETS,
  SET_NEW_FUNCTION_BUILD_IMAGE,
  SET_NEW_FUNCTION_PROJECT,
  RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE,
  FETCH_FUNCTION_LOGS_BEGIN,
  FETCH_FUNCTION_LOGS_FAILURE,
  FETCH_FUNCTION_LOGS_SUCCESS,
  REMOVE_FUNCTION_LOGS,
  SET_NEW_FUNCTION
} from '../constants'

const initialState = {
  functions: [],
  logs: {
    data: '',
    loading: false,
    error: null
  },
  loading: false,
  error: null,
  newFunction: {
    kind: 'job',
    metadata: {
      labels: {},
      name: '',
      tag: ''
    },
    spec: {
      args: [],
      build: {
        base_image: '',
        commands: [],
        functionSourceCode: '',
        image: ''
      },
      default_handler: '',
      description: '',
      env: [],
      image: '',
      volume_mounts: [],
      volumes: [],
      resources: {
        limits: {},
        requests: {}
      },
      secret_sources: []
    }
  },
  templatesCatalog: {},
  template: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true
      }
    case CREATE_NEW_FUNCTION_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case CREATE_NEW_FUNCTION_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
      }
    case DEPLOY_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true
      }
    case DEPLOY_FUNCTION_FAILURE:
      return {
        ...state,
        loading: false
      }
    case DEPLOY_FUNCTION_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
      }
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
    case FETCH_FUNCTION_LOGS_BEGIN:
      return {
        ...state,
        logs: {
          ...state.logs,
          loading: true
        }
      }
    case FETCH_FUNCTION_LOGS_FAILURE:
      return {
        ...state,
        logs: {
          data: initialState.logs.data,
          loading: false,
          error: payload
        }
      }
    case FETCH_FUNCTION_LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          data: `${state.logs.data}${payload}`,
          loading: false,
          error: null
        }
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
    case REMOVE_FUNCTION_LOGS:
      return {
        ...state,
        logs: initialState.logs
      }
    case REMOVE_FUNCTION_TEMPLATE:
      return {
        ...state,
        template: {}
      }
    case REMOVE_FUNCTIONS_ERROR:
      return {
        ...state,
        error: null
      }
    case REMOVE_NEW_FUNCTION:
      return {
        ...state,
        newFunction: initialState.newFunction
      }
    case RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              base_image: '',
              commands: '',
              image: ''
            }
          }
        }
      }
    case SET_NEW_FUNCTION:
      return {
        ...state,
        newFunction: payload
      }
    case SET_NEW_FUNCTION_BASE_IMAGE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              base_image: payload
            }
          }
        }
      }
    case SET_NEW_FUNCTION_BUILD_IMAGE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              image: payload
            }
          }
        }
      }
    case SET_NEW_FUNCTION_COMMANDS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              commands: payload
            }
          }
        }
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
    case SET_NEW_FUNCTION_ENV:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            env: payload
          }
        }
      }
    case SET_NEW_FUNCTION_HANDLER:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            default_handler: payload
          }
        }
      }
    case SET_NEW_FUNCTION_IMAGE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            image: payload
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
    case SET_NEW_FUNCTION_PROJECT:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          metadata: {
            ...state.newFunction.metadata,
            project: payload
          }
        }
      }
    case SET_NEW_FUNCTION_RESOURCES:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            resources: payload
          }
        }
      }
    case SET_NEW_FUNCTION_SECRETS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            secret_sources: payload
          }
        }
      }
    case SET_NEW_FUNCTION_SOURCE_CODE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              functionSourceCode: payload
            }
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
    case SET_NEW_FUNCTION_VOLUME_MOUNTS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            volume_mounts: payload
          }
        }
      }
    case SET_NEW_FUNCTION_VOLUMES:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            volumes: payload
          }
        }
      }
    default:
      return state
  }
}
