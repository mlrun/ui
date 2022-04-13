import {
  ABORT_JOB_BEGIN,
  ABORT_JOB_FAILURE,
  ABORT_JOB_SUCCESS,
  EDIT_JOB_FAILURE,
  FETCH_JOB_FUNCTION_BEGIN,
  FETCH_JOB_FUNCTION_FAILURE,
  FETCH_JOB_FUNCTION_SUCCESS,
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  REMOVE_JOB_ERROR,
  REMOVE_JOB_LOGS,
  REMOVE_NEW_JOB,
  RUN_NEW_JOB_FAILURE,
  REMOVE_SCHEDULED_JOB_FAILURE,
  SET_ALL_JOBS_DATA,
  SET_LOADING,
  SET_NEW_JOB_ENVIRONMENT_VARIABLES,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_SECRET_SOURCES,
  SET_NEW_JOB,
  SET_TUNING_STRATEGY,
  SET_URL,
  SET_NEW_JOB_SELECTOR_CRITERIA,
  SET_NEW_JOB_SELECTOR_RESULT,
  RUN_NEW_JOB_BEGIN,
  RUN_NEW_JOB_SUCCESS,
  SET_NEW_JOB_NODE_SELECTOR,
  FETCH_JOB_BEGIN,
  FETCH_JOB_FAILURE,
  FETCH_JOB_SUCCESS,
  SET_NEW_JOB_CREDENTIALS_ACCESS_KEY,
  FETCH_SCHEDULED_JOB_ACCESS_KEY_BEGIN,
  FETCH_SCHEDULED_JOB_ACCESS_KEY_END,
  REMOVE_JOB,
  FETCH_ALL_JOB_RUNS_BEGIN,
  FETCH_ALL_JOB_RUNS_FAILURE,
  FETCH_ALL_JOB_RUNS_SUCCESS,
  SET_NEW_JOB_PREEMTION_MODE,
  SET_NEW_JOB_PRIORITY_CLASS_NAME
} from '../constants'

const initialState = {
  allJobsData: [],
  job: {},
  jobRuns: [],
  jobs: [],
  logs: {
    data: '',
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
        secret_sources: [],
        param_file: '',
        selector: {
          criteria: 'max',
          result: ''
        },
        tuning_strategy: 'list'
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
  }
}

export default (state = initialState, { type, payload }) => {
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
    case EDIT_JOB_FAILURE:
      return {
        ...state,
        error: payload
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
        loading: true
      }
    case FETCH_JOB_FUNCTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_JOB_FUNCTION_SUCCESS:
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
          data: payload,
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
    case FETCH_SCHEDULED_JOB_ACCESS_KEY_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_SCHEDULED_JOB_ACCESS_KEY_END:
      return {
        ...state,
        loading: false
      }
    case REMOVE_JOB:
      return {
        ...state,
        job: {}
      }
    case REMOVE_JOB_LOGS:
      return {
        ...state,
        logs: initialState.logs
      }
    case REMOVE_JOB_ERROR:
      return {
        ...state,
        error: null
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
    case SET_ALL_JOBS_DATA:
      return {
        ...state,
        allJobsData: payload
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
              selector: {
                ...state.newJob.task.spec.selector,
                criteria: payload
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
              selector: {
                ...state.newJob.task.spec.selector,
                result: payload
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
              tuning_strategy: payload
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
              param_file: payload
            }
          }
        }
      }
    }
    default:
      return state
  }
}
