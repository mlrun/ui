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

// TODO: delete initialState data in ML-10005
const initialState = {
  applicationsSummary: {
    running_model_monitoring_functions: 16,
    failed_model_monitoring_functions: 8,
    real_time_model_endpoint_count: 75,
    batch_model_endpoint_count: 44,
    loading: false,
    error: null
  },
  monitoringApplication: {
    name: 'monitorAppV1',
    application_class: 'MyAppV1',
    started_at: '2025-05-01T12:00:00Z',
    updated_time: '2025-05-07T10:00:00Z',
    base_period: 10,
    nuclio_function_uri: 'my-project/functions/my-project-monitorAppV1/',
    stats: {
      detections: 1245,
      potential_detections: 98,
      lag: 2,
      committed_offset: 110,
      shards: {
        1: {
          committed: 50,
          lag: 2
        },
        2: {
          committed: 60,
          lag: 0
        }
      },
      processed_model_endpoints: 8,
      metrics: [
        {
          type: 'result',
          time: '2025-05-07T09:07:14+00:00',
          name: 'some_result',
          kind: 'data-drift',
          status: '2',
          value: 0.95
        },
        {
          type: 'metric',
          time: '2025-05-07T09:07:14+00:00',
          name: 'some_metric',
          value: 0.4
        }
      ]
    },
    status: 'ready'
  },
  monitoringApplications: {
    applications: [
      {
        name: 'monitorAppV1',
        application_class: 'MyAppV1',
        started_at: '2025-05-01T12:00:00Z',
        updated_time: '2025-05-07T10:00:00Z',
        base_period: 10,
        nuclio_function_uri: 'my-project/functions/my-project-monitorAppV1/',
        stats: {
          detections: 1245,
          potential_detections: 98,
          lag: 2,
          committed_offset: 110,
          shards: {
            1: {
              committed: 50,
              lag: 2
            },
            2: {
              committed: 60,
              lag: 0
            }
          },
          processed_model_endpoints: 8,
          metrics: [
            {
              type: 'result',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_result',
              kind: 'data-drift',
              status: 'Detection',
              value: 0.95
            },
            {
              type: 'metric',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_metric',
              value: 0.4
            }
          ]
        },
        status: 'ready'
      },
      {
        name: 'monitorAppV2',
        application_class: 'MyAppV2',
        started_at: '2025-05-01T08:00:00Z',
        updated_time: '2025-05-06T20:00:00Z',
        base_period: 10,
        nuclio_function_uri: 'default/functions/default-monitorAppV2/',
        stats: {
          detections: 567,
          potential_detections: 34,
          lag: 0,
          committed_offset: 10598,
          shards: {
            1: {
              committed: 50,
              lag: 2
            },
            2: {
              committed: 60,
              lag: 0
            }
          },
          processed_model_endpoints: 8,
          metrics: [
            {
              type: 'result',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_result',
              kind: 0,
              status: 2,
              value: 0.95
            },
            {
              type: 'metric',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_metric',
              value: 0.4
            }
          ]
        },
        status: 'ready'
      },
      {
        name: 'monitorAppV3',
        application_class: 'MyAppV3',
        started_at: '2025-05-02T09:00:00Z',
        updated_time: '2025-05-08T11:00:00Z',
        base_period: 15,
        nuclio_function_uri: 'default/functions/default-monitorAppV3/',
        stats: {
          detections: 850,
          potential_detections: 60,
          lag: 5,
          committed_offset: 203498,
          shards: {
            1: {
              committed: 50,
              lag: 2
            },
            2: {
              committed: 60,
              lag: 0
            }
          },
          processed_model_endpoints: 8,
          metrics: [
            {
              type: 'result',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_result',
              kind: 0,
              status: 2,
              value: 0.95
            },
            {
              type: 'metric',
              time: '2025-05-07T09:07:14+00:00',
              name: 'some_metric',
              value: 0.4
            }
          ]
        },
        status: 'ready'
      }
    ],
    operatingFunctions: [
      {
        name: 'model-monitoring-controller',
        application_class: 'modelMonitoringController',
        started_at: '2025-05-01T12:00:00Z',
        updated_time: '2025-05-07T10:00:00Z',
        base_period: 10,
        nuclio_function_uri: 'default/functions/default-modelMonitoringController/',
        stats: {
          detections: 1245,
          potential_detections: 98,
          lag: 12,
          committed_offset: 398742
        },
        status: 'ready'
      },
      {
        name: 'model-monitoring-stream',
        application_class: 'modelMonitoringStream',
        started_at: '2025-05-01T08:00:00Z',
        updated_time: '2025-05-06T20:00:00Z',
        base_period: 10,
        nuclio_function_uri: 'default/functions/default-modelMonitoringStream/',
        stats: {
          detections: 567,
          potential_detections: 34,
          lag: 0,
          committed_offset: 10598
        },
        status: 'ready'
      },
      {
        name: 'model-monitoring-writer',
        application_class: 'modelMonitoringWriter',
        started_at: '2025-05-01T08:00:00Z',
        updated_time: '2025-05-06T20:00:00Z',
        base_period: 10,
        nuclio_function_uri: 'default/functions/default-modelMonitoringWriter/',
        stats: {
          detections: 2567,
          potential_detections: 134,
          lag: 10,
          committed_offset: 110598
        },
        status: 'ready'
      }
    ]
  },
  loading: false,
  error: null
}

export const fetchMonitoringApplication = createAsyncThunk(
  'fetchMonitoringApplication',
  ({ project, functionName, filters }) => {
    const params = {
      start: filters[DATES_FILTER].value[0].getTime()
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
    removeMonitoringApplication(state) {
      state.monitoringApplication = initialState.monitoringApplication
    },
    removeMonitoringApplications(state) {
      state.monitoringApplications = initialState.monitoringApplications
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMonitoringApplication.pending, defaultPendingHandler)
    builder.addCase(fetchMonitoringApplication.fulfilled, (state, { payload }) => {
      state.monitoringApplication = payload
      state.loading = false
    })
    builder.addCase(fetchMonitoringApplication.rejected, defaultRejectedHandler)
    builder.addCase(fetchMonitoringApplications.pending, defaultPendingHandler)
    builder.addCase(fetchMonitoringApplications.fulfilled, (state, { payload }) => {
      state.monitoringApplications = payload
      state.loading = false
    })
    builder.addCase(fetchMonitoringApplications.rejected, defaultRejectedHandler)
    builder.addCase(fetchMonitoringApplicationsSummary.pending, state => {
      state.applicationsSummary.loading = true
    })
    builder.addCase(fetchMonitoringApplicationsSummary.fulfilled, (state, { payload }) => {
      state.applicationsSummary = payload
      state.applicationsSummary.loading = false
    })
    builder.addCase(fetchMonitoringApplicationsSummary.rejected, (state, action) => {
      state.applicationsSummary.loading = false
      state.applicationsSummary.error = action.error
    })
  }
})

export const { removeMonitoringApplication, removeMonitoringApplications } =
  monitoringApplicationsSlice.actions

export default monitoringApplicationsSlice.reducer
