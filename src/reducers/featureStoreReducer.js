import {
  CREATE_NEW_FEATURE_SET_BEGIN,
  CREATE_NEW_FEATURE_SET_FAILURE,
  CREATE_NEW_FEATURE_SET_SUCCESS,
  FETCH_ENTITIES_BEGIN,
  FETCH_ENTITIES_FAILURE,
  FETCH_ENTITIES_SUCCESS,
  FETCH_ENTITY_SUCCESS,
  FETCH_FEATURES_BEGIN,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_SUCCESS,
  FETCH_FEATURE_SETS_BEGIN,
  FETCH_FEATURE_SETS_FAILURE,
  FETCH_FEATURE_SETS_SUCCESS,
  FETCH_FEATURE_SUCCESS,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  REMOVE_ENTITIES,
  REMOVE_ENTITY,
  REMOVE_FEATURE,
  REMOVE_FEATURES,
  REMOVE_FEATURES_ERROR,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURE_VECTOR,
  REMOVE_FEATURE_VECTORS,
  REMOVE_NEW_FEATURE_SET,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KEY,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KIND,
  SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN,
  SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_URL,
  SET_NEW_FEATURE_SET_DESCRIPTION,
  SET_NEW_FEATURE_SET_LABELS,
  SET_NEW_FEATURE_SET_NAME,
  SET_NEW_FEATURE_SET_SCHEDULE,
  SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY,
  SET_NEW_FEATURE_SET_TARGET,
  SET_NEW_FEATURE_SET_VERSION,
  START_FEATURE_SET_INGEST_BEGIN,
  START_FEATURE_SET_INGEST_SUCCESS,
  FETCH_FEATURE_SET_SUCCESS,
  SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY,
  PANEL_DEFAULT_ACCESS_KEY
} from '../constants'

const initialState = {
  error: null,
  featureSets: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
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
  entities: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  loading: false,
  newFeatureSet: {
    credentials: {
      access_key: PANEL_DEFAULT_ACCESS_KEY
    },
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
        end_time: '',
        key_field: '',
        kind: 'csv',
        parse_dates: '',
        path: '',
        schedule: '',
        start_time: '',
        time_field: ''
      },
      targets: [
        {
          kind: 'parquet',
          name: 'parquet',
          path:
            'v3io:///projects/my-proj/FeatureStore/my-fs/parquet/sets/my-fs-my-tag'
        },
        {
          name: 'nosql',
          kind: 'nosql',
          online: true,
          path:
            'v3io:///projects/my-proj/FeatureStore/my-fs/nosql/sets/my-fs-my-tag'
        }
      ],
      timestamp_key: '',
      features: []
    },
    status: {}
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
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
    case FETCH_ENTITY_SUCCESS:
      return {
        ...state,
        entities: {
          ...state.entities,
          selectedRowData: {
            ...state.entities.selectedRowData,
            content: {
              ...state.entities.selectedRowData.content,
              ...payload
            }
          }
        }
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
    case FETCH_FEATURE_SET_SUCCESS:
      return {
        ...state,
        featureSets: {
          ...state.featureSets,
          selectedRowData: {
            ...state.featureSets.selectedRowData,
            content: {
              ...state.featureSets.selectedRowData.content,
              ...payload
            }
          }
        }
      }
    case FETCH_FEATURE_SETS_SUCCESS:
      return {
        ...state,
        error: false,
        featureSets: {
          ...state.featureSets,
          allData: payload
        },
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
    case FETCH_ENTITIES_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_ENTITIES_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case FETCH_ENTITIES_SUCCESS:
      return {
        ...state,
        error: false,
        entities: {
          ...state.entities,
          allData: payload
        },
        loading: false
      }
    case REMOVE_ENTITY:
      return {
        ...state,
        entities: {
          ...state.entities,
          selectedRowData: {
            content: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_ENTITIES:
      return {
        ...state,
        entities: {
          allData: [],
          selectedRowData: {
            content: {}
          }
        }
      }
    case REMOVE_FEATURE_SETS:
      return {
        ...state,
        featureSets: {
          allData: [],
          selectedRowData: {
            content: {}
          }
        }
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
        features: {
          allData: [],
          selectedRowData: {
            content: {}
          }
        }
      }
    case REMOVE_NEW_FEATURE_SET:
      return {
        ...state,
        newFeatureSet: { ...initialState.newFeatureSet }
      }
    case SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          credentials: {
            ...state.newFeatureSet.credentials,
            access_key: payload
          }
        }
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
    case SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              end_time: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              parse_dates: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME:
      return {
        ...state,
        newFeatureSet: {
          ...state.newFeatureSet,
          spec: {
            ...state.newFeatureSet.spec,
            source: {
              ...state.newFeatureSet.spec.source,
              start_time: payload
            }
          }
        }
      }
    case SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN:
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
    case REMOVE_FEATURES_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}
