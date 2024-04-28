/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import {
  CREATE_NEW_FUNCTION_BEGIN,
  CREATE_NEW_FUNCTION_FAILURE,
  CREATE_NEW_FUNCTION_SUCCESS,
  DEPLOY_FUNCTION_BEGIN,
  DEPLOY_FUNCTION_FAILURE,
  DEPLOY_FUNCTION_SUCCESS,
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_FUNCTIONS_TEMPLATES_FAILURE,
  FETCH_FUNCTION_NUCLIO_LOGS_BEGIN,
  FETCH_FUNCTION_NUCLIO_LOGS_FAILURE,
  FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS,
  FETCH_FUNCTION_LOGS_BEGIN,
  FETCH_FUNCTION_LOGS_FAILURE,
  FETCH_FUNCTION_LOGS_SUCCESS,
  FETCH_FUNCTION_TEMPLATE_BEGIN,
  FETCH_FUNCTION_TEMPLATE_FAILURE,
  FETCH_FUNCTION_TEMPLATE_SUCCESS,
  FETCH_HUB_FUNCTIONS_BEGIN,
  FETCH_HUB_FUNCTIONS_FAILURE,
  FETCH_HUB_FUNCTION_TEMPLATE_BEGIN,
  FETCH_HUB_FUNCTION_TEMPLATE_FAILURE,
  FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS,
  FUNCTION_TYPE_JOB,
  GET_FUNCTION_BEGIN,
  GET_FUNCTION_FAILURE,
  GET_FUNCTION_SUCCESS,
  PANEL_DEFAULT_ACCESS_KEY,
  REMOVE_FUNCTION,
  REMOVE_FUNCTIONS_ERROR,
  REMOVE_FUNCTION_TEMPLATE,
  REMOVE_HUB_FUNCTIONS,
  REMOVE_NEW_FUNCTION,
  RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE,
  SET_FUNCTIONS_TEMPLATES,
  SET_HUB_FUNCTIONS,
  SET_NEW_FUNCTION,
  SET_NEW_FUNCTION_BASE_IMAGE,
  SET_NEW_FUNCTION_BUILD_IMAGE,
  SET_NEW_FUNCTION_COMMANDS,
  SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY,
  SET_NEW_FUNCTION_DEFAULT_CLASS,
  SET_NEW_FUNCTION_DESCRIPTION,
  SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT,
  SET_NEW_FUNCTION_ENV,
  SET_NEW_FUNCTION_ERROR_STREAM,
  SET_NEW_FUNCTION_FORCE_BUILD,
  SET_NEW_FUNCTION_GRAPH,
  SET_NEW_FUNCTION_HANDLER,
  SET_NEW_FUNCTION_IMAGE,
  SET_NEW_FUNCTION_KIND,
  SET_NEW_FUNCTION_LABELS,
  SET_NEW_FUNCTION_NAME,
  SET_NEW_FUNCTION_PARAMETERS,
  SET_NEW_FUNCTION_PREEMTION_MODE,
  SET_NEW_FUNCTION_PRIORITY_CLASS_NAME,
  SET_NEW_FUNCTION_PROJECT,
  SET_NEW_FUNCTION_REQUIREMENTS,
  SET_NEW_FUNCTION_RESOURCES,
  SET_NEW_FUNCTION_SECRETS,
  SET_NEW_FUNCTION_SOURCE_CODE,
  SET_NEW_FUNCTION_TAG,
  SET_NEW_FUNCTION_TRACK_MODELS,
  SET_NEW_FUNCTION_VOLUMES,
  SET_NEW_FUNCTION_VOLUME_MOUNTS
} from '../constants'

const initialState = {
  hubFunctions: [],
  hubFunctionsCatalog: [],
  functions: [],
  func: {},
  logs: {
    loading: false,
    error: null
  },
  nuclioLogs: {
    loading: false,
    error: null
  },
  loading: false,
  error: null,
  newFunction: {
    kind: FUNCTION_TYPE_JOB,
    metadata: {
      credentials: {
        access_key: PANEL_DEFAULT_ACCESS_KEY
      },
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
        image: '',
        requirements: []
      },
      default_class: '',
      default_handler: '',
      description: '',
      env: [],
      image: '',
      priority_class_name: '',
      secret_sources: [],
      preemption_mode: '',
      volume_mounts: [],
      volumes: [],
      resources: {
        limits: {},
        requests: {}
      }
    }
  },
  templatesCatalog: {},
  templates: [],
  template: {}
}

const functionReducer = (state = initialState, { type, payload }) => {
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
        loading: !payload
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
          loading: false,
          error: payload
        }
      }
    case FETCH_FUNCTION_LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          loading: false,
          error: null
        }
      }
    case FETCH_FUNCTION_NUCLIO_LOGS_BEGIN:
      return {
        ...state,
        nuclioLogs: {
          ...state.nuclioLogs,
          loading: true
        }
      }
    case FETCH_FUNCTION_NUCLIO_LOGS_FAILURE:
      return {
        ...state,
        nuclioLogs: {
          loading: false,
          error: payload
        }
      }
    case FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS:
      return {
        ...state,
        nuclioLogs: {
          loading: false,
          error: null
        }
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
    case FETCH_FUNCTIONS_TEMPLATES_FAILURE:
      return {
        ...state,
        loading: false,
        templates: [],
        templatesCatalog: {},
        error: payload
      }
    case FETCH_HUB_FUNCTION_TEMPLATE_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case FETCH_HUB_FUNCTION_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_HUB_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_HUB_FUNCTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        hubFunctions: [],
        hubFunctionsCatalog: [],
        error: payload
      }
    case GET_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true
      }
    case GET_FUNCTION_FAILURE:
      return {
        ...state,
        loading: false,
        func: {},
        error: payload
      }
    case GET_FUNCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        template: payload,
        error: null
      }
    case REMOVE_FUNCTION:
      return {
        ...state,
        func: {}
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
    case REMOVE_HUB_FUNCTIONS:
      return {
        ...state,
        hubFunctions: [],
        hubFunctionsCatalog: []
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
    case SET_FUNCTIONS_TEMPLATES:
      return {
        ...state,
        templates: payload.templates,
        templatesCatalog: payload.templatesCategories
      }
    case SET_HUB_FUNCTIONS:
      return {
        ...state,
        loading: false,
        hubFunctions: payload.hubFunctions,
        hubFunctionsCatalog: payload.hubFunctionsCategories,
        error: null
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
    case SET_NEW_FUNCTION_REQUIREMENTS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            build: {
              ...state.newFunction.spec.build,
              requirements: payload
            }
          }
        }
      }
    case SET_NEW_FUNCTION_DEFAULT_CLASS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            default_class: payload
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
    case SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            disable_auto_mount: payload
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
    case SET_NEW_FUNCTION_ERROR_STREAM:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            error_stream: payload
          }
        }
      }
    case SET_NEW_FUNCTION_FORCE_BUILD:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          skip_deployed: payload
        }
      }
    case SET_NEW_FUNCTION_GRAPH:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            graph: payload
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
    case SET_NEW_FUNCTION_KIND:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          kind: payload
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
    case SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          metadata: {
            ...state.newFunction.metadata,
            credentials: {
              ...state.newFunction.metadata.credentials,
              access_key: payload
            }
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
    case SET_NEW_FUNCTION_PARAMETERS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            parameters: payload
          }
        }
      }
    case SET_NEW_FUNCTION_PRIORITY_CLASS_NAME:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            priority_class_name: payload
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
    case SET_NEW_FUNCTION_PREEMTION_MODE:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            preemption_mode: payload
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
            resources: {
              ...state.newFunction.spec.resources,
              ...payload
            }
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
    case SET_NEW_FUNCTION_TRACK_MODELS:
      return {
        ...state,
        newFunction: {
          ...state.newFunction,
          spec: {
            ...state.newFunction.spec,
            track_models: payload
          }
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

export default functionReducer
