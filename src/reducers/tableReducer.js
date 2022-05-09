import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isTablePanelOpen: false,
  features: {
    currentProject: '',
    featureVector: {},
    groupedFeatures: {},
    isNewFeatureVector: false,
    labelFeature: null
  }
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setFeaturesPanelData(state, action) {
      state.features = action.payload
    },
    setLabelFeature: (state, action) => {
      state.features.labelFeature = action.payload
    },
    setTablePanelOpen: (state, action) => {
      state.isTablePanelOpen = action.payload
    },
    updateCurrentProjectName: (state, action) => {
      state.features.currentProject = action.payload
    },
    updateFeatureVector: (state, action) => {
      state.features.featureVector.metadata = action.payload.metadata
      state.features.featureVector.spec = action.payload.spec
    },
    updateGroupedFeatures: (state, action) => {
      state.features.groupedFeatures[action.payload.project] = action.payload.groupedFeatures
    }
  }
})

export const {
  setFeaturesPanelData,
  setLabelFeature,
  setTablePanelOpen,
  updateCurrentProjectName,
  updateFeatureVector,
  updateGroupedFeatures
} = tableSlice.actions

export default tableSlice.reducer
