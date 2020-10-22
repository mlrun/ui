import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  REMOVE_ARTIFACTS,
  SET_ARTIFACT_FILTER,
  SHOW_ARTIFACT_PREVIEW
} from '../constants'

const initialState = {
  artifacts: [],
  dataSets: [],
  error: null,
  files: [],
  filter: {
    tag: 'latest',
    labels: '',
    name: ''
  },
  loading: false,
  models: [],
  preview: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CLOSE_ARTIFACT_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    case FETCH_ARTIFACTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_ARTIFACTS_FAILURE:
      return {
        ...state,
        artifacts: [],
        loading: false,
        error: payload
      }
    case FETCH_ARTIFACTS_SUCCESS:
      return {
        ...state,
        artifacts: payload,
        loading: false
      }
    case FETCH_DATASETS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_DATASETS_FAILURE:
      return {
        ...state,
        dataSets: [],
        error: payload,
        loading: false
      }
    case FETCH_DATASETS_SUCCESS:
      return {
        ...state,
        dataSets: payload,
        loading: false
      }
    case FETCH_FILES_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FILES_FAILURE:
      return {
        ...state,
        error: payload,
        files: [],
        loading: false
      }
    case FETCH_FILES_SUCCESS:
      return {
        ...state,
        files: payload,
        loading: false
      }
    case FETCH_MODELS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODELS_FAILURE:
      return {
        ...state,
        error: payload,
        models: [],
        loading: false
      }
    case FETCH_MODELS_SUCCESS:
      return {
        ...state,
        models: payload,
        loading: false
      }
    case REMOVE_ARTIFACTS:
      return {
        ...state,
        artifacts: []
      }
    case SET_ARTIFACT_FILTER:
      return {
        ...state,
        filter: payload
      }
    case SHOW_ARTIFACT_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    default:
      return state
  }
}
