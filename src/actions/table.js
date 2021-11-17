import {
  SET_FEATURES_PANEL_DATA,
  SET_TABLE_PANEL_OPEN,
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
  setTablePanelOpen: toggleOpen => ({
    type: SET_TABLE_PANEL_OPEN,
    payload: toggleOpen
  }),
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
