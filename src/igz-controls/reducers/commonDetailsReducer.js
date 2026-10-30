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
  changes: {
    counter: 0,
    data: {}
  },
  detailsPopUpInfoContent: {},
  editMode: false,
  infoContent: {},
  filtersWasHandled: false,
  showWarning: false
}

const commonsDetailsStoreSlice = createSlice({
  name: 'commonDetailsStore',
  initialState,
  reducers: {
    removeDetailsPopUpInfoContent(state) {
      state.detailsPopUpInfoContent = {}
    },
    removeInfoContent(state) {
      state.infoContent = {}
    },
    resetChanges(state) {
      state.changes = initialState.changes
    },
    setChanges(state, action) {
      state.changes = action.payload
    },
    setChangesCounter(state, action) {
      state.changes.counter = action.payload
    },
    setChangesData(state, action) {
      state.changes.data = action.payload
    },
    setDetailsPopUpInfoContent(state, action) {
      state.detailsPopUpInfoContent = action.payload
    },
    setEditMode(state, action) {
      state.editMode = action.payload
    },
    setFiltersWasHandled(state, action) {
      state.filtersWasHandled = action.payload
    },
    setInfoContent(state, action) {
      state.infoContent = action.payload
    },
    showWarning(state, action) {
      state.showWarning = action.payload
    }
  }
})

export const {
  removeDetailsPopUpInfoContent,
  removeInfoContent,
  resetChanges,
  setChanges,
  setChangesCounter,
  setChangesData,
  setDetailsPopUpInfoContent,
  setEditMode,
  setFiltersWasHandled,
  setInfoContent,
  showWarning
} = commonsDetailsStoreSlice.actions

export default commonsDetailsStoreSlice.reducer
