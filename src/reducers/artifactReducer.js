import {
  CLOSE_ARTIFACT_PREVIEW,
  CREATE_NEW_FEATURE_SET_BEGIN,
  CREATE_NEW_FEATURE_SET_FAILURE,
  CREATE_NEW_FEATURE_SET_SUCCESS,
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
  REMOVE_ARTIFACTS_ERROR,
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
  REMOVE_NEW_FEATURE_SET,
  SET_ARTIFACT_FILTER,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KEY,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KIND,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_URL,
  SET_NEW_FEATURE_SET_DESCRIPTION,
  SET_NEW_FEATURE_SET_LABELS,
  SET_NEW_FEATURE_SET_NAME,
  SET_NEW_FEATURE_SET_SCHEDULE,
  SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY,
  SET_NEW_FEATURE_SET_TARGET,
  SET_NEW_FEATURE_SET_VERSION,
  SHOW_ARTIFACT_PREVIEW,
  START_FEATURE_SET_INGEST_BEGIN,
  START_FEATURE_SET_INGEST_SUCCESS
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
  newFeatureSet: {
    metadata: {
      labels: {},
      name: '',
      tag: ''
    },
    spec: {
      description: '',
      entities: [],
      source: {
        attributes: {},
        key_field: '',
        kind: 'http',
        path: '',
        schedule: '',
        time_field: ''
      },
      targets: [],
      timestamp_key: '',
      features: []
    },
    status: {}
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
    case CREATE_NEW_FEATURE_SET_BEGIN:
      return {
        ...state,
        loading: true
      }
    case CREATE_NEW_FEATURE_SET_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case CREATE_NEW_FEATURE_SET_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false
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
    case REMOVE_NEW_FEATURE_SET:
      return {
        ...state,
        newFeatureSet: { ...initialState.newFeatureSet }
      }
    case SET_ARTIFACT_FILTER:
      return {
        ...state,
        filter: payload
      }
    case SET_NEW_FEATURE_SET_NAME:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          metadata: {
            ...state.newFeatureSet.metadata,
            name: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              attributes: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            entities: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_KEY:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              key_field: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_KIND:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              kind: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_TIME:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              time_field: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_URL:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              path: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DESCRIPTION:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            description: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_LABELS:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          metadata: {
            ...state.newFeatureSet.metadata,
            labels: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_SCHEDULE:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              schedule: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            timestamp_key: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_TARGET:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            targets: payload
          }
        }
      }
    case SET_NEW_FEATURE_SET_VERSION:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          metadata: {
            ...state.newFeatureSet.metadata,
            tag: payload
          }
        }
      }
    case SHOW_ARTIFACT_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    case START_FEATURE_SET_INGEST_BEGIN:
      return {
        ...state,
        loading: true
      }
    case START_FEATURE_SET_INGEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    default:
      return state
  }
}
