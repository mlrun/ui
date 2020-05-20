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
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_SCHEDULE
} from '../constants'

const initialState = {
  jobs: [],
  logs: '',
  loading: false,
  error: null,
  newJob: {
    schedule: '',
    task: {
      spec: {
        parameters: {},
        inputs: {},
        hyperparams: {}
      }
    },
    function: {
      spec: {
        volumes: [],
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
    case SET_NEW_JOB_SCHEDULE:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          schedule: payload
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
    default:
      return state
  }
}
