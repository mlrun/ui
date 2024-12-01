import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import alertsApi from '../api/alerts-api'
import { defaultPendingHandler } from './redux.util'
import { parseAlerts } from '../utils/parseAlert'

const initialState = {
  alerts: [],
  error: null,
  loading: false
}

export const fetchAlert = createAsyncThunk('fetchAlert', ({ project, filters, config }) => {
  return alertsApi.getAlert(project, filters, config).then(({ data }) => {
    return parseAlerts(data.activations)
  })
})
export const fetchAlerts = createAsyncThunk('fetchAlerts', ({ project, filters, config }) => {
  return alertsApi.getAlerts(project, filters, config).then(({ data }) => {
    return parseAlerts(data.activations)
  })
})

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
