import {
  SET_FEATURES_PANEL_DATA,
  SET_LABEL_FEATURE,
  SET_TABLE_PANEL_OPEN,
  UPDATE_CURRENT_PROJECT_NAME,
  UPDATE_FEATURE_VECTOR,
  UPDATE_GROUPED_FEATURES
} from '../constants'

const tableActions = {
  setFeaturesPanelData: panelData => dispatch => {
    return dispatch({
      type: SET_FEATURES_PANEL_DATA,
      payload: panelData
    })
  },
  setLabelFeature: labelFeature => dispatch => {
    return dispatch({
      type: SET_LABEL_FEATURE,
      payload: labelFeature
    })
  },
  setTablePanelOpen: toggleOpen => ({
    type: SET_TABLE_PANEL_OPEN,
    payload: toggleOpen
  }),
  updateCurrentProjectName: projectName => dispatch => {
    return dispatch({
      type: UPDATE_CURRENT_PROJECT_NAME,
      payload: projectName
    })
  },
  updateFeatureVector: featureVectorData => dispatch => {
    return dispatch({
      type: UPDATE_FEATURE_VECTOR,
      payload: featureVectorData
    })
  },
  updateGroupedFeatures: groupedFeatures => dispatch => {
    return dispatch({
      type: UPDATE_GROUPED_FEATURES,
      payload: groupedFeatures
    })
  }
}

export default tableActions
