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
import { ENTITY_KIND, ENTITY_TYPE, EVENT_KIND, EVENT_TYPE, FILTER_ALL_ITEMS } from '../constants'

const initialState = {
  alerts: [],
  error: null,
  loading: false
}

const generateRequestParams = filters => {
  const params = {}
  if (filters.name) {
    params.name = `~${filters.name}`
  }

  if (filters?.dates) {
    if (filters.dates.value[0]) {
      params.since = filters.dates.value[0].toISOString()
    }

    if (filters.dates.value[1] && !filters.dates.isPredefined) {
      params.until = filters.dates.value[1].toISOString()
    }
  }

  // TODO: add logic for the entity-id based on entity-type after integration with backend

  if (filters?.[ENTITY_TYPE] && filters?.[ENTITY_TYPE] !== FILTER_ALL_ITEMS) {
    params[ENTITY_KIND] = filters?.[ENTITY_TYPE]
  }

  if (
    filters?.severity &&
    filters.severity !== FILTER_ALL_ITEMS &&
    !filters.severity.includes(FILTER_ALL_ITEMS)
  ) {
    params.severity = filters.severity
  }

  if (filters?.[EVENT_TYPE] && filters?.[EVENT_TYPE] !== FILTER_ALL_ITEMS) {
    params[EVENT_KIND] = filters?.[EVENT_TYPE]
  }

  return params
}

export const fetchAlert = createAsyncThunk(
  'fetchAlert',
  ({ project, filters, config }, thunkAPI) => {
    const newConfig = {
      ...config,
      params: {
        ...config.params,
        ...generateRequestParams(filters, project)
      }
    }

    config?.ui?.setRequestErrorMessage?.('')

    return alertsApi
      .getAlert(project, filters, newConfig)
      .then(({ data }) => {
        return parseAlerts(data.activations || [])
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
    const newConfig = {
      ...config,
      params: {
        ...config.params,
        ...generateRequestParams(filters, project)
      }
    }

    config?.ui?.setRequestErrorMessage?.('')

    return alertsApi
      .getAlerts(project, newConfig)
      .then(({ data }) => {
        return { ...data, activations: parseAlerts(data.activations || []) }
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
