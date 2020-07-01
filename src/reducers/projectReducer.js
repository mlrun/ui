import {
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  REMOVE_NEW_PROJECT,
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
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PROJECTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: payload,
        loading: false
      }
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        loading: false,
        error: payload
      }
    case REMOVE_NEW_PROJECT:
      return {
        ...state,
        newProject: {
          name: '',
          description: ''
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
    case SET_NEW_PROJECT_DESCRIPTION:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          description: payload
        }
      }
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    default:
      return state
  }
}
