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
import { DATE_FILTER_ANY_TIME, DEFAULT_ABORT_MSG } from '../constants'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import detailsApi from '../api/details-api'
import { generatePods } from '../utils/generatePods'
import modelEndpointsApi from '../api/modelEndpoints-api'
import {
  generateMetricsItems,
  parseMetrics
} from '../components/DetailsMetrics/detailsMetrics.util'
import { isEmpty } from 'lodash'
import { TIME_FRAME_LIMITS } from '../utils/datePicker.util'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const initialState = {
  dates: {
    value: DATE_FILTER_ANY_TIME,
    selectedOptionId: '',
    isPredefined: false
  },
  detailsJobPods: {
    loading: true,
    podsList: [],
    podsPending: [],
    podsTooltip: []
  },
  error: null,
  iteration: '',
  iterationOptions: [],
  runAttempt: '0',
  runAttemptOptions: [],
  loadingCounter: 0,
  modelFeatureVectorData: {},
  pods: {
    loading: true,
    podsList: [],
    podsPending: [],
    podsTooltip: []
  },
  metricsOptions: {
    all: [],
    lastSelected: [],
    preselected: [],
    selectedByEndpoint: {}
  }
}

export const fetchModelFeatureVector = createAsyncThunk(
  'fetchModelFeatureVector',
  ({ project, name, reference }, thunkAPI) => {
    return detailsApi
      .getModelFeatureVector(project, name, reference)
      .then(response => {
        return response.data.status
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)

export const fetchDetailsJobPods = createAsyncThunk(
  'fetchDetailsJobPods',
  ({ project, uid, kind }, thunkAPI) => {
    return detailsApi
      .getJobPods(project, uid, kind)
      .then(({ data }) => {
        return generatePods(project, uid, data)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)

export const fetchJobPods = createAsyncThunk('fetchJobPods', ({ project, uid, kind }, thunkAPI) => {
  return detailsApi
    .getJobPods(project, uid, kind)
    .then(({ data }) => {
      return generatePods(project, uid, data)
    })
    .catch(error => thunkAPI.rejectWithValue(error))
})

export const fetchModelEndpointMetrics = createAsyncThunk(
  'fetchEndpointMetrics',
  ({ project, uid, applicationName = '' }, thunkAPI) => {
    return modelEndpointsApi
      .getModelEndpointMetrics(project, uid)
      .then(({ data = [] }) => {
        const metrics = generateMetricsItems(data, applicationName)

        return { endpointUid: uid, metrics, applicationName }
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)

export const fetchModelEndpointMetricsValues = createAsyncThunk(
  'fetchModelEndpointMetricsValues',
  ({ project, uid, params, abortController, setRequestErrorMessage = () => {} }, thunkAPI) => {
    const config = {
      params,
      ui: {
        controller: abortController,
        setRequestErrorMessage,
        customErrorMessage:
          'The query result is too large to display. Reduce either the number of metrics or the time period.'
      }
    }

    setRequestErrorMessage('')

    return modelEndpointsApi
      .getModelEndpointMetricsValues(project, uid, config)
      .then(({ data = [] }) => {
        const differenceInDays = params.end - params.start
        const timeUnit = differenceInDays > TIME_FRAME_LIMITS['24_HOURS'] ? 'days' : 'hours'

        return parseMetrics(data, timeUnit)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch metrics',
          thunkAPI.dispatch,
          setRequestErrorMessage
        )
        return thunkAPI.rejectWithValue(error?.message === DEFAULT_ABORT_MSG ? null : error)
      })
  }
)

const detailsStoreSlice = createSlice({
  name: 'detailsStore',
  initialState,
  reducers: {
    removeDetailsPods(state) {
      state.detailsJobPods = initialState.detailsJobPods
    },
    removeModelFeatureVector(state) {
      state.modelFeatureVectorData = initialState.modelFeatureVectorData
    },
    removePods(state) {
      state.pods = initialState.pods
    },
    setDetailsDates(state, action) {
      state.dates = action.payload
    },
    setIteration(state, action) {
      state.iteration = action.payload
    },
    setIterationOption(state, action) {
      state.iterationOptions = action.payload
    },
    setRunAttempt(state, action) {
      state.runAttempt = action.payload
    },
    setRunAttemptOptions(state, action) {
      state.runAttemptOptions = action.payload
    },
    setSelectedMetricsOptions(state, action) {
      state.metricsOptions = {
        ...state.metricsOptions,
        lastSelected: action.payload.metrics,
        selectedByEndpoint: {
          ...state.metricsOptions.selectedByEndpoint,
          [action.payload.endpointUid]: action.payload.metrics
        }
      }
    },
    increaseDetailsLoadingCounter(state) {
      state.loadingCounter = state.loadingCounter + 1
    },
    decreaseDetailsLoadingCounter(state) {
      state.loadingCounter = state.loadingCounter - 1
    },
    clearMetricsOptions(state) {
      state.metricsOptions = {
        all: [],
        lastSelected: [],
        preselected: [],
        selectedByEndpoint: {}
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchModelFeatureVector.pending, state => {
      state.loadingCounter = state.loadingCounter + 1
    })
    builder.addCase(fetchModelFeatureVector.fulfilled, (state, action) => {
      state.loadingCounter = state.loadingCounter - 1
      state.modelFeatureVectorData = { ...action.payload }
      state.error = null
    })
    builder.addCase(fetchModelFeatureVector.rejected, (state, action) => {
      state.loadingCounter = state.loadingCounter - 1
      state.modelFeatureVectorData = { ...initialState.modelFeatureVectorData }
      state.error = action.payload
    })
    builder.addCase(fetchDetailsJobPods.pending, state => {
      state.detailsJobPods.loading = true
    })
    builder.addCase(fetchDetailsJobPods.fulfilled, (state, action) => {
      state.detailsJobPods = { ...action.payload, loading: false }
      state.error = null
    })
    builder.addCase(fetchDetailsJobPods.rejected, (state, action) => {
      state.detailsJobPods.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchJobPods.pending, state => {
      state.pods.loading = true
    })
    builder.addCase(fetchJobPods.fulfilled, (state, action) => {
      state.pods = { ...action.payload, loading: false }
      state.error = null
    })
    builder.addCase(fetchJobPods.rejected, (state, action) => {
      state.pods.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchModelEndpointMetrics.pending, state => {
      state.loadingCounter = state.loadingCounter + 1
    })
    builder.addCase(fetchModelEndpointMetrics.fulfilled, (state, action) => {
      const areMetricsSelectedForEndpoint = !isEmpty(
        state.metricsOptions.selectedByEndpoint[action.payload.endpointUid]
      )
      const selectedMetrics = areMetricsSelectedForEndpoint
        ? state.metricsOptions.selectedByEndpoint[action.payload.endpointUid]
        : action.payload.metrics.filter(metric => {
            return state.metricsOptions.lastSelected.find(
              selectedMetric =>
                selectedMetric.name === metric.name &&
                selectedMetric.app === metric.app &&
                selectedMetric.type === metric.type
            )
          })

      state.error = null
      state.loadingCounter = state.loadingCounter - 1
      state.metricsOptions = {
        all: action.payload.metrics,
        lastSelected: selectedMetrics,
        preselected: selectedMetrics,
        selectedByEndpoint: areMetricsSelectedForEndpoint
          ? state.metricsOptions.selectedByEndpoint
          : {
              ...state.metricsOptions.selectedByEndpoint,
              [action.payload.endpointUid]: selectedMetrics
            }
      }
    })
    builder.addCase(fetchModelEndpointMetrics.rejected, (state, action) => {
      state.loadingCounter = state.loadingCounter - 1
      state.error = action.payload
      state.metricsOptions.all = []
    })
    builder.addCase(fetchModelEndpointMetricsValues.pending, state => {
      state.loadingCounter = state.loadingCounter + 1
    })
    builder.addCase(fetchModelEndpointMetricsValues.fulfilled, state => {
      state.loadingCounter = state.loadingCounter - 1
      state.error = null
    })
    builder.addCase(fetchModelEndpointMetricsValues.rejected, (state, action) => {
      state.loadingCounter = state.loadingCounter - 1
      state.error = action.payload
    })
  }
})

export const {
  removeDetailsPods,
  removeModelFeatureVector,
  removePods,
  setDetailsDates,
  setIteration,
  setIterationOption,
  setRunAttempt,
  setRunAttemptOptions,
  setSelectedMetricsOptions,
  increaseDetailsLoadingCounter,
  decreaseDetailsLoadingCounter,
  clearMetricsOptions
} = detailsStoreSlice.actions

export default detailsStoreSlice.reducer
