import {
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECT_BEGIN,
  FETCH_PROJECT_FUNCTIONS_SUCCESS,
  FETCH_PROJECT_JOBS_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_FUNCTIONS_FAILURE,
  FETCH_PROJECT_FUNCTIONS_BEGIN,
  FETCH_PROJECT_JOBS_FAILURE,
  FETCH_PROJECT_JOBS_BEGIN,
  REMOVE_NEW_PROJECT,
  REMOVE_PROJECT_DATA,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME
} from '../constants'

const initialState = {
  projects: [],
  loading: false,
  error: null,
  newProject: {
    name: '',
    description: ''
  },
  project: {
    data: null,
    loading: false,
    error: null,
    jobs: {
      data: null,
      loading: false,
      error: null
    },
    functions: {
      data: null,
      loading: false,
      error: null
    }
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PROJECT_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          loading: true
        }
      }
    case FETCH_PROJECT_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECT_JOBS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_JOBS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            error: payload
          }
        }
      }
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          data: payload,
          loading: false
        }
      }
    case FETCH_PROJECT_JOBS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        loading: false,
        error: payload
      }
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: payload,
        loading: false
      }
    case REMOVE_PROJECT_DATA:
      return {
        ...state,
        project: {
          data: null,
          loading: false,
          error: null,
          jobs: {
            data: null,
            loading: false,
            error: null
          },
          functions: {
            data: null,
            loading: false,
            error: null
          }
        }
      }
    case REMOVE_NEW_PROJECT:
      return {
        ...state,
        newProject: {
          name: '',
          description: ''
        }
      }
    case SET_NEW_PROJECT_DESCRIPTION:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          description: payload
        }
      }
    case SET_NEW_PROJECT_NAME:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          name: payload
        }
      }
    default:
      return state
  }
}
