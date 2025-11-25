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
import { parseV3ioStreams } from '../utils/parseV3ioStreams'
import { parseV3ioStreamShardLags } from '../utils/parseV3ioStreamShardLags'

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
  ({ project, signal }, { rejectWithValue }) => {
    return nuclioApi
      .getFunctions(project, signal)
      .then(({ data }) => {
        return Object.values(data)
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

const initialState = {
  apiGateways: 0,
  functions: {},
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
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchApiGateways.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchApiGateways.fulfilled, (state, action) => {
      state.apiGateways = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchApiGateways.rejected, (state, action) => {
      state.apiGateways = 0
      state.loading = false
      state.error = action.error?.message
    })
    builder.addCase(fetchNuclioFunctions.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchNuclioFunctions.fulfilled, (state, action) => {
      state.currentProjectFunctions = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchNuclioFunctions.rejected, (state, action) => {
      state.currentProjectFunctions = []
      state.loading = false
      state.error = action.error?.message
    })
    builder.addCase(fetchAllNuclioFunctions.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchAllNuclioFunctions.fulfilled, (state, action) => {
      state.functions = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchAllNuclioFunctions.rejected, (state, action) => {
      state.functions = {}
      state.loading = false
      state.error = action.error?.message
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
  }
})

export const { removeV3ioStreams, resetV3ioStreamsError, resetV3ioStreamShardLagsError } =
  nuclioSlice.actions

export default nuclioSlice.reducer
