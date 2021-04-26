import {
  SET_FEATURES_PANEL_DATA,
  SET_TABLE_PANEL_OPEN,
  UPDATE_FEATURE_VECTOR,
  UPDATE_GROUPED_FEATURES
} from '../constants'

const initialState = {
  isTablePanelOpen: false,
  features: {
    currentProject: '',
    featureVector: {},
    groupedFeatures: {},
    isNewFeatureVector: false
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FEATURES_PANEL_DATA:
      return {
        ...state,
        features: { ...payload }
      }
    case SET_TABLE_PANEL_OPEN:
      return {
        ...state,
        isTablePanelOpen: payload
      }
    case UPDATE_FEATURE_VECTOR:
      return {
        ...state,
        features: {
          ...state.features,
          featureVector: {
            ...state.features.featureVector,
            metadata: {
              ...state.features.featureVector.metadata,
              ...payload.metadata
            },
            spec: {
              ...state.features.featureVector.spec,
              ...payload.spec
            }
          }
        }
      }
    case UPDATE_GROUPED_FEATURES:
      return {
        ...state,
        features: {
          ...state.features,
          groupedFeatures: {
            ...state.features.groupedFeatures,
            [state.features.featureVector.metadata.project]: payload
          }
        }
      }
    default:
      return state
  }
}
