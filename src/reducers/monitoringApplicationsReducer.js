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

import { defaultPendingHandler, defaultRejectedHandler } from './redux.util'
import { splitApplicationsContent } from '../utils/applications.utils'
import monitoringApplicationsApi from '../api/monitoringApplications-api'
import { DATES_FILTER } from '../constants'

const initialState = {
  applicationsSummary: {
    loading: false,
    error: null
  },
  endpointsWithDetections: {
    data: {
      values: [],
      start: null,
      end: null
    },
    loading: false,
    error: null
  },
  monitoringApplication: {},
  monitoringApplications: {
    applications: [],
    operatingFunctions: []
  },
  loading: false,
  error: null
}

export const fetchMEPWithDetections = createAsyncThunk(
  'fetchMEPWithDetections',
  ({ project, filters }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    const savedStartDate = filters[DATES_FILTER].value[0].getTime()
    const savedEndDate = (filters[DATES_FILTER].value[1] || new Date()).getTime()
    
    return monitoringApplicationsApi.getMEPWithDetections(project, params).then(response => {
      return {
         values: response.data.values.map(([date, suspected, detected]) => [date, suspected + detected]),
         start: savedStartDate,
         end: savedEndDate
      }
    })
  }
)

export const fetchMonitoringApplication = createAsyncThunk(
  'fetchMonitoringApplication',
  ({ project, functionName, filters }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    return monitoringApplicationsApi
      .getMonitoringApplication(project, functionName, params)
      .then(response => response.data)
  }
)

export const fetchMonitoringApplications = createAsyncThunk(
  'fetchMonitoringApplications',
  ({ project, filters }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
    }

    if (filters[DATES_FILTER].value[1]) {
      params.end = filters[DATES_FILTER].value[1].getTime()
    }

    return monitoringApplicationsApi.getMonitoringApplications(project, params).then(response => {
      return splitApplicationsContent(response.data)
    })
  }
)

export const fetchMonitoringApplicationsSummary = createAsyncThunk(
  'fetchMonitoringApplicationsSummary',
  ({ project }) => {
    return monitoringApplicationsApi
      .getMonitoringApplicationsSummary(project)
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
    builder.addCase(fetchMEPWithDetections.pending, state => {
      state.endpointsWithDetections.loading = true
    })
    builder.addCase(fetchMEPWithDetections.fulfilled, (state, { payload }) => {
      state.endpointsWithDetections.data = payload
      state.endpointsWithDetections.loading = false
      state.endpointsWithDetections.error = null
    })
    builder.addCase(fetchMEPWithDetections.rejected, (state, action) => {
      state.endpointsWithDetections.loading = false
      state.endpointsWithDetections.error = action.error
    })
    builder.addCase(fetchMonitoringApplication.pending, defaultPendingHandler)
    builder.addCase(fetchMonitoringApplication.fulfilled, (state, { payload }) => {
      state.monitoringApplication = payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchMonitoringApplication.rejected, defaultRejectedHandler)
    builder.addCase(fetchMonitoringApplications.pending, defaultPendingHandler)
    builder.addCase(fetchMonitoringApplications.fulfilled, (state, { payload }) => {
      state.monitoringApplications = payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchMonitoringApplications.rejected, defaultRejectedHandler)
    builder.addCase(fetchMonitoringApplicationsSummary.pending, state => {
      state.applicationsSummary.loading = true
    })
    builder.addCase(fetchMonitoringApplicationsSummary.fulfilled, (state, { payload }) => {
      state.applicationsSummary = payload
      state.applicationsSummary.loading = false
      state.applicationsSummary.error = null
    })
    builder.addCase(fetchMonitoringApplicationsSummary.rejected, (state, action) => {
      state.applicationsSummary.loading = false
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
