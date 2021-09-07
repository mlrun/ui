import {
  BUILD_FUNCTION_BEGIN,
  BUILD_FUNCTION_FAILURE,
  BUILD_FUNCTION_SUCCESS,
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATA_SET_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILE_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_MODEL_ENDPOINTS_BEGIN,
  FETCH_MODEL_ENDPOINTS_FAILURE,
  FETCH_MODEL_ENDPOINTS_SUCCESS,
  FETCH_MODEL_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  REMOVE_ARTIFACTS,
  REMOVE_ARTIFACTS_ERROR,
  REMOVE_DATASET,
  REMOVE_DATASETS,
  REMOVE_FILE,
  REMOVE_FILES,
  REMOVE_MODEL,
  REMOVE_MODELS,
  SHOW_ARTIFACT_PREVIEW
} from '../constants'

const initialState = {
  artifacts: [],
  dataSets: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  error: null,
  files: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  loading: false,
  modelEndpoints: [],
  models: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  preview: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case BUILD_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true
      }
    case BUILD_FUNCTION_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case BUILD_FUNCTION_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
      }
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
    case FETCH_DATA_SET_SUCCESS:
      return {
        ...state,
        dataSets: {
          ...state.dataSets,
          selectedRowData: {
            ...state.dataSets.selectedRowData,
            content: {
              ...state.dataSets.selectedRowData.content,
              ...payload
            }
          }
        }
      }
    case FETCH_DATASETS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_DATASETS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_DATASETS_SUCCESS:
      return {
        ...state,
        error: null,
        dataSets: {
          ...state.dataSets,
          allData: payload
        },
        loading: false
      }
    case FETCH_FILE_SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          selectedRowData: {
            ...state.files.selectedRowData,
            content: {
              ...state.files.selectedRowData.content,
              ...payload
            }
          }
        }
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
        loading: false
      }
    case FETCH_FILES_SUCCESS:
      return {
        ...state,
        error: null,
        files: {
          ...state.files,
          allData: payload
        },
        loading: false
      }
    case FETCH_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FUNCTIONS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_FUNCTIONS_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
      }
    case FETCH_MODEL_ENDPOINTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_MODEL_ENDPOINTS_FAILURE:
      return {
        ...state,
        error: payload,
        modelEndpoints: [],
        loading: false
      }
    case FETCH_MODEL_ENDPOINTS_SUCCESS:
      return {
        ...state,
        modelEndpoints: payload,
        loading: false
      }
    case FETCH_MODEL_SUCCESS:
      return {
        ...state,
        models: {
          ...state.models,
          selectedRowData: {
            ...state.models.selectedRowData,
            content: {
              ...state.models.selectedRowData.content,
              ...payload
            }
          }
        }
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
        loading: false
      }
    case FETCH_MODELS_SUCCESS:
      return {
        ...state,
        models: {
          ...state.models,
          allData: payload
        },
        loading: false
      }
    case REMOVE_ARTIFACTS:
      return {
        ...state,
        artifacts: []
      }
    case REMOVE_ARTIFACTS_ERROR:
      return {
        ...state,
        error: null
      }
    case REMOVE_DATASET:
      return {
        ...state,
        dataSets: {
          ...state.dataSets,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_DATASETS:
      return {
        ...state,
        dataSets: {
          ...initialState.dataSets
        }
      }
    case REMOVE_FILE:
      return {
        ...state,
        files: {
          ...state.files,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_FILES:
      return {
        ...state,
        files: {
          ...initialState.files
        }
      }
    case REMOVE_MODEL:
      return {
        ...state,
        models: {
          ...state.models,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_MODELS:
      return {
        ...state,
        models: {
          ...initialState.models
        }
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
