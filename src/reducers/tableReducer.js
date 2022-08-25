/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
      state.features.featureVector.metadata = {
        ...state.features.featureVector.metadata,
        ...action.payload.metadata
      }
      state.features.featureVector.spec = {
        ...state.features.featureVector.spec,
        ...action.payload.spec
      }
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
