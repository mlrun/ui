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
  ABORT_JOB_BEGIN,
  ABORT_JOB_FAILURE,
  ABORT_JOB_SUCCESS,
  DELETE_JOB_BEGIN,
  DELETE_JOB_FAILURE,
  DELETE_JOB_SUCCESS,
  EDIT_JOB_BEGIN,
  EDIT_JOB_FAILURE,
  EDIT_JOB_SUCCESS,
  FETCH_ALL_JOB_RUNS_BEGIN,
  FETCH_ALL_JOB_RUNS_FAILURE,
  FETCH_ALL_JOB_RUNS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  FETCH_JOB_BEGIN,
  FETCH_JOB_FAILURE,
  FETCH_JOB_FUNCTIONS_BEGIN,
  FETCH_JOB_FUNCTIONS_FAILURE,
  FETCH_JOB_FUNCTIONS_SUCCESS,
  FETCH_JOB_FUNCTION_BEGIN,
  FETCH_JOB_FUNCTION_FAILURE,
  FETCH_JOB_FUNCTION_SUCCESS,
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOB_SUCCESS,
  FETCH_SCHEDULED_JOBS_BEGIN,
  FETCH_SCHEDULED_JOBS_FAILURE,
  FETCH_SCHEDULED_JOBS_SUCCESS,
  REMOVE_JOB,
  REMOVE_JOB_ERROR,
  REMOVE_JOB_FUNCTION,
  REMOVE_NEW_JOB,
  REMOVE_SCHEDULED_JOB_FAILURE,
  RUN_NEW_JOB_BEGIN,
  RUN_NEW_JOB_FAILURE,
  RUN_NEW_JOB_SUCCESS,
  SET_JOBS_DATA,
  SET_LOADING,
  SET_NEW_JOB,
  SET_NEW_JOB_CREDENTIALS_ACCESS_KEY,
  SET_NEW_JOB_ENVIRONMENT_VARIABLES,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_NODE_SELECTOR,
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_PREEMTION_MODE,
  SET_NEW_JOB_PRIORITY_CLASS_NAME,
  SET_NEW_JOB_SECRET_SOURCES,
  SET_NEW_JOB_SELECTOR_CRITERIA,
  SET_NEW_JOB_SELECTOR_RESULT,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_TUNING_STRATEGY,
  SET_URL
} from '../constants'

const initialState = {
  jobsData: [],
  job: {},
  jobFunc: {},
  jobRuns: [],
  jobs: [],
  logs: {
    loading: false,
    error: null
  },
  loading: false,
  error: null,
  newJob: {
    task: {
      spec: {
        parameters: {},
        inputs: {},
        hyperparams: {},
        hyper_param_options: {
          strategy: 'list',
          param_file: '',
          selector: {
            criteria: 'max',
            result: ''
          }
        },
        secret_sources: []
      }
    },
    function: {
      metadata: {
        credentials: {
          access_key: ''
        }
      },
      spec: {
        env: [],
        node_selector: {},
        preemption_mode: '',
        priority_class_name: '',
        volume_mounts: [],
        volumes: []
      }
    }
  },
  scheduled: []
}

const jobReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ABORT_JOB_BEGIN:
      return {
        ...state,
        loading: true
      }
    case ABORT_JOB_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case ABORT_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case DELETE_JOB_BEGIN:
      return {
        ...state,
        loading: true
      }
    case DELETE_JOB_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case DELETE_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case EDIT_JOB_BEGIN:
      return {
        ...state,
        loading: true
      }
    case EDIT_JOB_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case EDIT_JOB_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_ALL_JOB_RUNS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_ALL_JOB_RUNS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_ALL_JOB_RUNS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jobRuns: payload
      }
    case FETCH_JOB_LOGS_BEGIN:
      return {
        ...state,
        logs: {
          ...state.logs,
          loading: true
        }
      }
    case FETCH_JOB_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOB_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        job: payload
      }
    case FETCH_JOB_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true,
        jobFunc: {}
      }
    case FETCH_JOB_FUNCTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        jobFunc: {}
      }
    case FETCH_JOB_FUNCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jobFunc: payload
      }
    case FETCH_JOB_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOB_FUNCTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_JOB_FUNCTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case FETCH_JOB_LOGS_FAILURE:
      return {
        ...state,
        logs: {
          data: [],
          loading: false,
          error: payload
        }
      }
    case FETCH_JOB_LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          loading: false,
          error: null
        }
      }
    case FETCH_JOBS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOBS_FAILURE:
      return {
        ...state,
        jobs: [],
        loading: false,
        error: payload
      }
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: payload,
        loading: false
      }
    case FETCH_SCHEDULED_JOBS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_SCHEDULED_JOBS_FAILURE:
      return {
        ...state,
        scheduled: [],
        loading: false,
        error: payload
      }
    case FETCH_SCHEDULED_JOBS_SUCCESS:
      return {
        ...state,
        scheduled: payload,
        loading: false
      }
    case REMOVE_JOB:
      return {
        ...state,
        job: {}
      }
    case REMOVE_JOB_ERROR:
      return {
        ...state,
        error: null
      }
    case REMOVE_JOB_FUNCTION:
      return {
        ...state,
        jobFunc: {}
      }
    case REMOVE_NEW_JOB:
      return {
        ...state,
        newJob: {
          ...initialState.newJob
        }
      }
    case RUN_NEW_JOB_BEGIN:
      return {
        ...state,
        loading: true
      }
    case RUN_NEW_JOB_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case RUN_NEW_JOB_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
      }
    case REMOVE_SCHEDULED_JOB_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case SET_JOBS_DATA:
      return {
        ...state,
        jobsData: payload
      }
    case SET_LOADING: {
      return {
        ...state,
        loading: payload
      }
    }
    case SET_NEW_JOB:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              parameters: payload.parameters,
              inputs: payload.inputs,
              secret_sources: payload.secret_sources
            }
          },
          function: {
            ...state.newJob.function,
            metadata: {
              ...state.newJob.function.metadata,
              credentials: {
                ...state.newJob.function.metadata.credentials,
                access_key: payload.access_key
              }
            },
            spec: {
              ...state.newJob.function.spec,
              volume_mounts: payload.volume_mounts,
              volumes: payload.volumes,
              env: payload.environmentVariables,
              node_selector: payload.node_selector,
              preemption_mode: payload.preemption_mode,
              priority_class_name: payload.priority_class_name
            }
          }
        }
      }
    case SET_NEW_JOB_CREDENTIALS_ACCESS_KEY:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            metadata: {
              ...state.newJob.function.metadata,
              credentials: {
                ...state.newJob.function.metadata.credentials,
                access_key: payload
              }
            }
          }
        }
      }
    case SET_NEW_JOB_ENVIRONMENT_VARIABLES:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              env: payload
            }
          }
        }
      }
    case SET_NEW_JOB_INPUTS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              inputs: payload
            }
          }
        }
      }
    case SET_NEW_JOB_NODE_SELECTOR:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              node_selector: payload
            }
          }
        }
      }
    case SET_NEW_JOB_PARAMETERS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              parameters: payload
            }
          }
        }
      }
    case SET_NEW_JOB_PREEMTION_MODE:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              preemption_mode: payload
            }
          }
        }
      }
    case SET_NEW_JOB_PRIORITY_CLASS_NAME:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              priority_class_name: payload
            }
          }
        }
      }
    case SET_NEW_JOB_SECRET_SOURCES:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              secret_sources: payload
            }
          }
        }
      }
    case SET_NEW_JOB_VOLUME_MOUNTS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              volume_mounts: payload
            }
          }
        }
      }
    case SET_NEW_JOB_VOLUMES:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              volumes: payload
            }
          }
        }
      }
    case SET_NEW_JOB_HYPER_PARAMETERS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              hyperparams: payload
            }
          }
        }
      }
    case SET_NEW_JOB_SELECTOR_CRITERIA: {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              hyper_param_options: {
                ...state.newJob.task.spec.hyper_param_options,
                selector: {
                  ...state.newJob.task.spec.hyper_param_options.selector,
                  criteria: payload
                }
              }
            }
          }
        }
      }
    }
    case SET_NEW_JOB_SELECTOR_RESULT: {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              hyper_param_options: {
                ...state.newJob.task.spec.hyper_param_options,
                selector: {
                  ...state.newJob.task.spec.hyper_param_options.selector,
                  result: payload
                }
              }
            }
          }
        }
      }
    }
    case SET_TUNING_STRATEGY: {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              hyper_param_options: {
                ...state.newJob.task.spec.hyper_param_options,
                strategy: payload
              }
            }
          }
        }
      }
    }
    case SET_URL: {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              hyper_param_options: {
                ...state.newJob.task.spec.hyper_param_options,
                param_file: payload
              }
            }
          }
        }
      }
    }
    default:
      return state
  }
}

export default jobReducer
