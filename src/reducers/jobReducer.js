import {
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  REMOVE_JOB_LOGS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_VOLUMES
} from '../constants'

const initialState = {
  jobs: [],
  logs: '',
  loading: false,
  error: null,
  newJob: {
    parameters: {},
    dataInputs: {
      inputs: {},
      volumes: {},
      general: {}
    },
    resources: {},
    schedule: {}
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
          dataInputs: {
            ...state.newJob.dataInputs,
            inputs: payload
          }
        }
      }
    case SET_NEW_JOB_VOLUMES:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          dataInputs: {
            ...state.newJob.dataInputs,
            volumes: payload
          }
        }
      }
    default:
      return state
  }
}
