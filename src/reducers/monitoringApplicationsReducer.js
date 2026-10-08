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
import { get } from 'lodash'

import { splitApplicationsContent } from '../utils/applications.utils'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { getErrorMsg } from 'igz-controls/utils/common.util'

import { DATES_FILTER } from '../constants'
import { isRequestAborted } from '../utils/isRequestAborted'
import { isStaleRequest, requestPending, requestSettled } from './redux.util'

import monitoringApplicationsApi from '../api/monitoringApplications-api'
import nuclioApi from '../api/nuclio'

const initialState = {
  applicationsSummary: {
    loading: false,
    pendingRequestIds: [],
    currentRequestId: null,
    error: null
  },
  endpointsWithDetections: {
    data: {
      values: [],
      start: null,
      end: null
    },
    loading: false,
    pendingRequestIds: [],
    currentRequestId: null,
    error: null
  },
  monitoringApplication: {},
  monitoringApplications: {
    applications: [],
    operatingFunctions: []
  },
  loading: false,
  pendingRequestIds: [],
  error: null
}

export const fetchMEPWithDetections = createAsyncThunk(
  'fetchMEPWithDetections',
  ({ project, filters, signal }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    const savedStartDate = filters[DATES_FILTER].value[0].getTime()
    const savedEndDate = (filters[DATES_FILTER].value[1] || new Date()).getTime()

    return monitoringApplicationsApi
      .getMEPWithDetections(project, params, signal)
      .then(response => {
        return {
          values: response.data.values.map(([date, suspected, detected]) => [
            date,
            suspected + detected
          ]),
          start: savedStartDate,
          end: savedEndDate
        }
      })
  }
)

export const fetchMonitoringApplication = createAsyncThunk(
  'fetchMonitoringApplication',
  ({ project, functionName, filters, signal }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    return monitoringApplicationsApi
      .getMonitoringApplication(project, functionName, params, signal)
      .then(response => response.data)
  }
)

export const fetchMonitoringApplications = createAsyncThunk(
  'fetchMonitoringApplications',
  async ({ project, filters, signal }, thunkAPI) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    const [mlrunResult, nuclioResult] = await Promise.allSettled([
      monitoringApplicationsApi.getMonitoringApplications(project, params, signal),
      nuclioApi.getFunctions(project, signal)
    ])

    if (mlrunResult.status !== 'fulfilled') {
      const isCanceled = largeResponseCatchHandler(
        mlrunResult.reason,
        'Failed to fetch monitoring applications',
        thunkAPI.dispatch
      )

      return thunkAPI.rejectWithValue(
        isCanceled ? { aborted: true } : getErrorMsg(mlrunResult.reason)
      )
    }

    const mlrunApiApps = get(mlrunResult, 'value.data')
    const nuclioApiApps = get(nuclioResult, 'value.data')

    const splitApps = splitApplicationsContent(mlrunApiApps)

    const applications = splitApps.applications.map(mlrunApp => {
      const match = nuclioApiApps[`${mlrunApp.project_name}-${mlrunApp.name}`]

      return {
        ...mlrunApp,
        status: match?.status?.state ?? mlrunApp.status
      }
    })

    return { ...splitApps, applications }
  }
)

export const fetchMonitoringApplicationsSummary = createAsyncThunk(
  'fetchMonitoringApplicationsSummary',
  ({ project, signal }) => {
    return monitoringApplicationsApi
      .getMonitoringApplicationsSummary(project, signal)
      .then(response => response.data)
  }
)

const monitoringApplicationsSlice = createSlice({
  name: 'monitoringApplicationsStore',
  initialState,
  reducers: {
    removeMEPWithDetections(state) {
      state.endpointsWithDetections = initialState.endpointsWithDetections
    },
    removeMonitoringApplication(state) {
      state.monitoringApplication = initialState.monitoringApplication
    },
    removeMonitoringApplications(state) {
      state.monitoringApplications = initialState.monitoringApplications
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMEPWithDetections.pending, (state, action) => {
      requestPending(state.endpointsWithDetections, action)
    })
    builder.addCase(fetchMEPWithDetections.fulfilled, (state, action) => {
      requestSettled(state.endpointsWithDetections, action)
      if (isStaleRequest(state.endpointsWithDetections, action)) return
      state.endpointsWithDetections.data = action.payload
      state.endpointsWithDetections.error = null
    })
    builder.addCase(fetchMEPWithDetections.rejected, (state, action) => {
      requestSettled(state.endpointsWithDetections, action)
      if (isStaleRequest(state.endpointsWithDetections, action)) return
      if (isRequestAborted(action.error)) return

      state.endpointsWithDetections.error = action.error
    })
    builder.addCase(fetchMonitoringApplication.pending, requestPending)
    builder.addCase(fetchMonitoringApplication.fulfilled, (state, action) => {
      requestSettled(state, action)
      state.monitoringApplication = action.payload
      state.error = null
    })
    builder.addCase(fetchMonitoringApplication.rejected, (state, action) => {
      requestSettled(state, action)
      if (isRequestAborted(action.error)) return

      state.error = action.error
    })
    builder.addCase(fetchMonitoringApplications.pending, requestPending)
    builder.addCase(fetchMonitoringApplications.fulfilled, (state, action) => {
      requestSettled(state, action)
      state.monitoringApplications = action.payload
      state.error = null
    })
    builder.addCase(fetchMonitoringApplications.rejected, (state, action) => {
      requestSettled(state, action)
      if (isRequestAborted(action.payload)) return

      state.error = action.payload
    })
    builder.addCase(fetchMonitoringApplicationsSummary.pending, (state, action) => {
      requestPending(state.applicationsSummary, action)
    })
    builder.addCase(fetchMonitoringApplicationsSummary.fulfilled, (state, action) => {
      requestSettled(state.applicationsSummary, action)
      if (isStaleRequest(state.applicationsSummary, action)) return

      const { pendingRequestIds, currentRequestId, loading } = state.applicationsSummary

      state.applicationsSummary = {
        ...action.payload,
        pendingRequestIds,
        currentRequestId,
        loading,
        error: null
      }
    })
    builder.addCase(fetchMonitoringApplicationsSummary.rejected, (state, action) => {
      requestSettled(state.applicationsSummary, action)
      if (isStaleRequest(state.applicationsSummary, action)) return
      if (isRequestAborted(action.error)) return

      state.applicationsSummary.error = action.error
    })
  }
})

export const {
  removeMEPWithDetections,
  removeMonitoringApplication,
  removeMonitoringApplications
} = monitoringApplicationsSlice.actions

export default monitoringApplicationsSlice.reducer
