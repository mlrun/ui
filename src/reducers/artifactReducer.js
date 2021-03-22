import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATA_SET_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FEATURE_SETS_BEGIN,
  FETCH_FEATURE_SETS_FAILURE,
  FETCH_FEATURE_SETS_SUCCESS,
  FETCH_FEATURE_SUCCESS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  FETCH_FEATURES_BEGIN,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_SUCCESS,
  FETCH_FILE_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_MODEL_ENDPOINTS_BEGIN,
  FETCH_MODEL_ENDPOINTS_FAILURE,
  FETCH_MODEL_ENDPOINTS_SUCCESS,
  FETCH_MODEL_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  REMOVE_ARTIFACTS,
  REMOVE_DATASET,
  REMOVE_DATASETS,
  REMOVE_FEATURE,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURE_VECTOR,
  REMOVE_FEATURE_VECTORS,
  REMOVE_FEATURES,
  REMOVE_FILE,
  REMOVE_FILES,
  REMOVE_MODEL,
  REMOVE_MODELS,
  SET_ARTIFACT_FILTER,
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
  featureSets: [],
  featureVectors: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  features: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  files: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  filter: {
    tag: 'latest',
    labels: '',
    name: ''
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
        error: false,
        dataSets: {
          ...state.dataSets,
          allData: payload
        },
        loading: false
      }
    case FETCH_FEATURE_SETS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FEATURE_SETS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_FEATURE_SETS_SUCCESS:
      return {
        ...state,
        error: false,
        featureSets: payload,
        loading: false
      }
    case FETCH_FEATURE_VECTOR_SUCCESS:
      return {
        ...state,
        featureVectors: {
          ...state.featureVectors,
          selectedRowData: {
            ...state.featureVectors.selectedRowData,
            content: {
              ...state.featureVectors.selectedRowData.content,
              ...payload
            }
          }
        }
      }
    case FETCH_FEATURE_VECTORS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FEATURE_VECTORS_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_FEATURE_VECTORS_SUCCESS:
      return {
        ...state,
        error: false,
        featureVectors: {
          ...state.featureVectors,
          allData: payload
        },
        loading: false
      }
    case FETCH_FEATURE_SUCCESS:
      return {
        ...state,
        features: {
          ...state.features,
          selectedRowData: {
            ...state.features.selectedRowData,
            content: {
              ...state.features.selectedRowData.content,
              ...payload
            }
          }
        }
      }
    case FETCH_FEATURES_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FEATURES_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_FEATURES_SUCCESS:
      return {
        ...state,
        error: false,
        features: {
          ...state.features,
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
        error: false,
        files: {
          ...state.files,
          allData: payload
        },
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
    case REMOVE_FEATURE_SETS:
      return {
        ...state,
        featureSets: []
      }
    case REMOVE_FEATURE_VECTOR:
      return {
        ...state,
        featureVectors: {
          ...state.featureVectors,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_FEATURE_VECTORS:
      return {
        ...state,
        featureVectors: {
          allData: [],
          selectedRowData: {
            content: {},
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_FEATURE:
      return {
        ...state,
        features: {
          ...state.features,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_FEATURES:
      return {
        ...state,
        features: []
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
        model: {
          ...state.model,
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
