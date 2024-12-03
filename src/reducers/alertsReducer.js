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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import alertsApi from '../api/alerts-api'
import { defaultPendingHandler } from './redux.util'
import { parseAlerts } from '../utils/parseAlert'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const initialState = {
  alerts: [],
  error: null,
  loading: false
}

export const fetchAlert = createAsyncThunk(
  'fetchAlert',
  ({ project, filters, config }, thunkAPI) => {
    return alertsApi
      .getAlert(project, filters, config)
      .then(({ data }) => {
        return parseAlerts(data.alerts)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch alerts',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)
export const fetchAlerts = createAsyncThunk(
  'fetchAlerts',
  ({ project, filters, config }, thunkAPI) => {
    return alertsApi
      .getAlerts(project, filters, config)
      .then(({ data }) => {
        return parseAlerts(data.alerts)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch alerts',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)

const alertsSlice = createSlice({
  name: 'alertsStore',
  initialState,
  reducers: {
    removeAlerts(state) {
      state.alerts = initialState.alerts
      state.error = null
      state.loading = false
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAlert.pending, defaultPendingHandler)
      .addCase(fetchAlert.fulfilled, (state, action) => {
        state.alerts = action.payload
        state.loading = false
      })
      .addCase(fetchAlert.rejected, (state, action) => {
        state.alerts = []
        state.error = action.payload
        state.loading = false
      })
      .addCase(fetchAlerts.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.alerts = action.payload
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { removeAlerts } = alertsSlice.actions

export default alertsSlice.reducer
