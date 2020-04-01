import {
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  REMOVE_JOB_LOGS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_NEW_JOB_OUTPUT_PATH,
  SET_NEW_JOB_INPUT_PATH
} from '../constants'

const initialState = {
  jobs: [],
  logs: '',
  loading: false,
  error: null,
  newJob: {
    task: {
      spec: {
        parameters: {},
        inputs: {},
        output_path: '',
        input_path: ''
      }
    },
    function: {
      spec: {
        volumes: [],
        resources: {
          limits: {
            cpu: '',
            memory: '',
            nvidia_gpu: ''
          },
          requests: {
            cpu: '',
            memory: ''
          }
        },
        volumeMounts: []
      }
    }
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOBS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: payload,
        loading: false
      }
    case FETCH_JOBS_FAILURE:
      return {
        ...state,
        jobs: [],
        loading: false,
        error: payload
      }
    case FETCH_JOB_LOGS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_JOB_LOGS_SUCCESS:
      return {
        ...state,
        logs: payload,
        loading: false
      }
    case FETCH_JOB_LOGS_FAILURE:
      return {
        ...state,
        logs: [],
        loading: false,
        error: payload
      }
    case REMOVE_JOB_LOGS:
      return {
        ...state,
        logs: ''
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
    case SET_NEW_JOB_VOLUME_MOUNTS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          function: {
            ...state.newJob.function,
            spec: {
              ...state.newJob.function.spec,
              volumeMounts: payload
            }
          }
        }
      }
    case SET_NEW_JOB:
      return {
        ...state,
        newJob: payload
      }
    case SET_NEW_JOB_OUTPUT_PATH:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              output_path: payload
            }
          }
        }
      }
    case SET_NEW_JOB_INPUT_PATH:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          task: {
            ...state.newJob.task,
            spec: {
              ...state.newJob.task.spec,
              input_path: payload
            }
          }
        }
      }
    default:
      return state
  }
}
