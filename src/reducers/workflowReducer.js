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
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import workflowApi from '../api/workflow-api'
import { parseWorkflow } from '../components/Workflow/workflow.util'
import { isNil } from 'lodash'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { parseWorkflows } from '../utils/parseWorkflows'
import { JOBS_MONITORING_WORKFLOWS_TAB, MONITOR_WORKFLOWS_TAB } from '../constants'

const initialState = {
  workflows: {
    data: [],
    loading: false,
    error: null
  },
  activeWorkflow: {
    data: {},
    loading: false,
    error: null,
    workflowJobsIds: []
  }
}

export const fetchWorkflow = createAsyncThunk('fetchWorkflow', ({ project, workflowId }) => {
  return workflowApi.getWorkflow(project, workflowId).then(response => parseWorkflow(response.data))
})
export const fetchWorkflows = createAsyncThunk(
  'fetchWorkflows',
  async ({ project, filter, config, withPagination }, { rejectWithValue }) => {
    const page = project === '*' ? JOBS_MONITORING_WORKFLOWS_TAB : MONITOR_WORKFLOWS_TAB
    let result = []
    let nextPageToken = ''

    config?.ui?.setRequestErrorMessage?.('')

    const errorHandler = error => {
      largeResponseCatchHandler(
        error,
        'Failed to fetch workflows',
        null,
        config?.ui?.setRequestErrorMessage
      )

      return rejectWithValue(error)
    }

    try {
      if (withPagination) {
        while (!isNil(nextPageToken)) {
          const response = await workflowApi.getWorkflows(project, filter, config, nextPageToken)

          if (response.error) {
            nextPageToken = null
            return errorHandler(response.error)
          } else {
            result = result.concat(response.data.runs)
            nextPageToken = response.data.next_page_token
          }
        }

        if (filter.project) {
          result = result.filter(workflow =>
            workflow.project.includes(filter.project.toLowerCase())
          )
        }

        return parseWorkflows(result, page)
      } else {
        const response = await workflowApi.getWorkflows(project, filter, config)

        if (response.error) {
          return errorHandler(response.error)
        }

        return parseWorkflows(response.data.runs, page)
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const rerunWorkflow = createAsyncThunk('rerunWorkflow', ({ project, workflowId }) => {
  return workflowApi.rerunWorkflow(project, workflowId)
})

const workflowsSlice = createSlice({
  name: 'workflowsStore',
  initialState,
  reducers: {
    deleteWorkflows(state) {
      state.workflows = initialState.workflows
    },
    resetWorkflow(state) {
      state.activeWorkflow.data = {}
      state.activeWorkflow.workflowJobsIds = []
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchWorkflow.pending, state => {
      state.activeWorkflow.loading = true
    })
    builder.addCase(fetchWorkflow.fulfilled, (state, action) => {
      state.activeWorkflow = {
        data: action.payload,
        loading: false,
        error: null,
        workflowJobsIds: Object.values(action.payload.graph).map(jobData => jobData.run_uid)
      }
    })
    builder.addCase(fetchWorkflow.rejected, (state, action) => {
      state.activeWorkflow = {
        data: {},
        loading: false,
        error: action.payload,
        workflowJobsIds: []
      }
    })
    builder.addCase(fetchWorkflows.pending, state => {
      state.workflows.loading = true
    })
    builder.addCase(fetchWorkflows.fulfilled, (state, action) => {
      state.workflows = {
        data: action.payload,
        loading: false,
        error: null
      }
    })
    builder.addCase(fetchWorkflows.rejected, (state, action) => {
      state.workflows = {
        data: [],
        loading: false,
        error: action.payload
      }
    })
  }
})

export const { deleteWorkflows, resetWorkflow } = workflowsSlice.actions

export default workflowsSlice.reducer
