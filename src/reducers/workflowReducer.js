import {
  FETCH_WORKFLOW_BEGIN,
  FETCH_WORKFLOW_FAILURE,
  FETCH_WORKFLOW_SUCCESS,
  FETCH_WORKFLOWS_BEGIN,
  FETCH_WORKFLOWS_FAILURE,
  FETCH_WORKFLOWS_SUCCESS,
  RESET_WORKFLOW
} from '../constants'

const initialState = {
  workflows: {
    data: [],
    loading: false,
    error: null
  },
  activeWorkflow: {
    data: {},
    loading: false,
    error: null,
    workflowJobsIds: []
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_WORKFLOW_BEGIN:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          loading: true
        }
      }
    case FETCH_WORKFLOW_SUCCESS:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: payload,
          loading: false,
          error: null,
          workflowJobsIds: Object.values(payload.graph).map(
            jobData => jobData.run_uid
          )
        }
      }
    case FETCH_WORKFLOW_FAILURE:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: {},
          loading: false,
          error: payload
        }
      }
    case FETCH_WORKFLOWS_BEGIN:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          loading: true
        }
      }
    case FETCH_WORKFLOWS_SUCCESS:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          data: payload,
          loading: false,
          error: null
        }
      }
    case FETCH_WORKFLOWS_FAILURE:
      return {
        ...state,
        workflows: {
          ...state.workflows,
          data: [],
          loading: false,
          error: payload
        }
      }
    case RESET_WORKFLOW:
      return {
        ...state,
        activeWorkflow: {
          ...state.activeWorkflow,
          data: {}
        }
      }
    default:
      return state
  }
}
