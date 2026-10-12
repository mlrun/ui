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
import { groupBy, property } from 'lodash'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import nuclioApi from '../api/nuclio'
import functionsApi from '../api/functions-api'
import { parseV3ioStreams } from '../utils/parseV3ioStreams'
import { parseV3ioStreamShardLags } from '../utils/parseV3ioStreamShardLags'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { isRequestAborted } from '../utils/isRequestAborted'
import { requestPending, requestSettled } from './redux.util'

export const fetchApiGateways = createAsyncThunk(
  'fetchApiGateways',
  ({ project, signal }, { rejectWithValue }) => {
    return nuclioApi
      .getApiGateways(project, signal)
      .then(({ data }) => {
        return Object.keys(data).length
      })
      .catch(rejectWithValue)
  }
)

export const fetchNuclioFunctions = createAsyncThunk(
  'fetchNuclioFunctions',
  ({ project, signal, getOriginalData = false }, { rejectWithValue }) => {
    return nuclioApi
      .getFunctions(project, signal)
      .then(({ data }) => {
        return getOriginalData ? data : Object.values(data)
      })
      .catch(rejectWithValue)
  }
)

export const fetchAllNuclioFunctions = createAsyncThunk(
  'fetchAllNuclioFunctions',
  (_, { rejectWithValue }) => {
    return nuclioApi
      .getFunctions()
      .then(({ data }) => {
        return groupBy(data, property(['metadata', 'labels', 'nuclio.io/project-name']))
      })
      .catch(rejectWithValue)
  }
)

export const fetchNuclioFunction = createAsyncThunk(
  'fetchNuclioFunction',
  ({ project, name, signal, enrichApiGateways = false }, { rejectWithValue }) => {
    return nuclioApi
      .getFunction(project, name, { signal, enrichApiGateways })
      .then(({ data }) => data)
      .catch(rejectWithValue)
  }
)

export const fetchNuclioV3ioStreamShardLags = createAsyncThunk(
  'fetchNuclioV3ioStreamShardLags',
  ({ project, body }, { rejectWithValue }) => {
    return nuclioApi
      .getV3ioStreamShardLags(project, body)
      .then(({ data }) => {
        return {
          data,
          parsedData: parseV3ioStreamShardLags(data, body)
        }
      })
      .catch(rejectWithValue)
  }
)

export const fetchNuclioV3ioStreams = createAsyncThunk(
  'fetchNuclioV3ioStreams',
  ({ project, signal }, { rejectWithValue }) => {
    return nuclioApi
      .getV3ioStreams(project, signal)
      .then(({ data }) => {
        return {
          data: data,
          parsedData: parseV3ioStreams(data)
        }
      })
      .catch(rejectWithValue)
  }
)

export const fetchProjectApiGateways = createAsyncThunk(
  'fetchProjectApiGateways',
  ({ project, signal }, { rejectWithValue, dispatch }) => {
    return functionsApi
      .getProjectApiGateways(project, { signal })
      .then(({ data }) => {
        const gateways = data?.api_gateways ?? data

        if (Array.isArray(gateways)) return gateways
        if (gateways && typeof gateways === 'object') return Object.values(gateways)

        return []
      })
      .catch(error => {
        if (!isRequestAborted(error)) {
          showErrorNotification(dispatch, error, 'Failed to load API gateways')
        }

        return rejectWithValue(error)
      })
  }
)

const initialState = {
  apiGateways: 0,
  projectApiGateways: [],
  projectApiGatewaysLoading: false,
  projectApiGatewaysPendingIds: [],
  projectApiGatewaysCurrentId: null,
  projectApiGatewaysError: null,
  functions: {},
  nuclioFunctionLoading: false,
  v3ioStreams: {
    error: null,
    loading: false,
    data: {},
    parsedData: []
  },
  v3ioStreamShardLags: {
    error: null,
    loading: false,
    data: {},
    parsedData: []
  },
  currentProjectFunctions: [],
  loading: false,
  pendingRequestIds: [],
  error: null
}

const nuclioSlice = createSlice({
  name: 'nuclioStore',
  initialState,
  reducers: {
    removeV3ioStreams(state) {
      state.v3ioStreams = {
        loading: false,
        error: null,
        data: {},
        parsedData: []
      }
    },
    resetV3ioStreamsError(state) {
      state.v3ioStreams.error = null
    },
    resetV3ioStreamShardLagsError(state) {
      state.v3ioStreamShardLags.error = null
    },
    clearProjectApiGateways(state) {
      state.projectApiGateways = []
      state.projectApiGatewaysLoading = false
      state.projectApiGatewaysPendingIds = []
      state.projectApiGatewaysCurrentId = null
      state.projectApiGatewaysError = null
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchApiGateways.pending, requestPending)
    builder.addCase(fetchApiGateways.fulfilled, (state, action) => {
      requestSettled(state, action)
      state.apiGateways = action.payload
      state.error = null
    })
    builder.addCase(fetchApiGateways.rejected, (state, action) => {
      requestSettled(state, action)
      state.apiGateways = 0
      state.error = action.payload?.message
    })
    builder.addCase(fetchNuclioFunctions.pending, requestPending)
    builder.addCase(fetchNuclioFunctions.fulfilled, (state, action) => {
      requestSettled(state, action)
      state.currentProjectFunctions = action.payload
      state.error = null
    })
    builder.addCase(fetchNuclioFunctions.rejected, (state, action) => {
      requestSettled(state, action)
      if (isRequestAborted(action.payload)) return
      state.currentProjectFunctions = []
      state.error = action.payload?.message
    })
    builder.addCase(fetchAllNuclioFunctions.pending, requestPending)
    builder.addCase(fetchAllNuclioFunctions.fulfilled, (state, action) => {
      requestSettled(state, action)
      state.functions = action.payload
      state.error = null
    })
    builder.addCase(fetchAllNuclioFunctions.rejected, (state, action) => {
      requestSettled(state, action)
      if (isRequestAborted(action.payload)) return
      state.functions = {}
      state.error = action.payload?.message
    })
    builder.addCase(fetchNuclioFunction.pending, state => {
      state.nuclioFunctionLoading = true
    })
    builder.addCase(fetchNuclioFunction.fulfilled, state => {
      state.nuclioFunctionLoading = false
    })
    builder.addCase(fetchNuclioFunction.rejected, state => {
      state.nuclioFunctionLoading = false
    })
    builder.addCase(fetchNuclioV3ioStreamShardLags.pending, state => {
      state.v3ioStreamShardLags = {
        loading: true,
        error: null,
        data: {},
        parsedData: []
      }
    })
    builder.addCase(fetchNuclioV3ioStreamShardLags.fulfilled, (state, action) => {
      state.v3ioStreamShardLags = {
        loading: false,
        error: null,
        data: action.payload.data,
        parsedData: action.payload.parsedData
      }
    })
    builder.addCase(fetchNuclioV3ioStreamShardLags.rejected, (state, action) => {
      state.v3ioStreamShardLags = {
        loading: false,
        error: action.payload,
        data: {},
        parsedData: []
      }
    })

    builder.addCase(fetchNuclioV3ioStreams.pending, state => {
      state.v3ioStreams = {
        loading: true,
        error: null,
        data: {},
        parsedData: []
      }
    })
    builder.addCase(fetchNuclioV3ioStreams.fulfilled, (state, action) => {
      state.v3ioStreams = {
        loading: false,
        error: null,
        data: action.payload.data,
        parsedData: action.payload.parsedData
      }
    })
    builder.addCase(fetchNuclioV3ioStreams.rejected, (state, action) => {
      state.v3ioStreams = {
        loading: false,
        error: action.payload,
        data: {},
        parsedData: []
      }
    })

    builder.addCase(fetchProjectApiGateways.pending, (state, action) => {
      state.projectApiGatewaysPendingIds = [
        ...state.projectApiGatewaysPendingIds,
        action.meta.requestId
      ]
      state.projectApiGatewaysCurrentId = action.meta.requestId
      state.projectApiGatewaysLoading = true
      state.projectApiGatewaysError = null
    })
    builder.addCase(fetchProjectApiGateways.fulfilled, (state, action) => {
      state.projectApiGatewaysPendingIds = state.projectApiGatewaysPendingIds.filter(
        id => id !== action.meta.requestId
      )
      state.projectApiGatewaysLoading = state.projectApiGatewaysPendingIds.length > 0
      if (action.meta.requestId !== state.projectApiGatewaysCurrentId) return
      state.projectApiGateways = action.payload
      state.projectApiGatewaysError = null
    })
    builder.addCase(fetchProjectApiGateways.rejected, (state, action) => {
      state.projectApiGatewaysPendingIds = state.projectApiGatewaysPendingIds.filter(
        id => id !== action.meta.requestId
      )
      state.projectApiGatewaysLoading = state.projectApiGatewaysPendingIds.length > 0
      if (action.meta.requestId !== state.projectApiGatewaysCurrentId) return
      if (isRequestAborted(action.payload)) return
      state.projectApiGateways = []
      state.projectApiGatewaysError = action.payload?.message
    })
  }
})

export const {
  clearProjectApiGateways,
  removeV3ioStreams,
  resetV3ioStreamsError,
  resetV3ioStreamShardLagsError
} = nuclioSlice.actions

export default nuclioSlice.reducer
