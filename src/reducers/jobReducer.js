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
import jobsApi from '../api/jobs-api'
import { hideLoading, showLoading } from './redux.util'
import { get } from 'lodash'
import {
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  LABELS_FILTER,
  NAME_FILTER,
  STATUS_FILTER,
  TYPE_FILTER
} from '../constants'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import functionsApi from '../api/functions-api'
import { showErrorNotification } from '../utils/notifications.util'
import { getNewJobErrorMsg } from '../components/JobWizard/JobWizard.util'

const initialState = {
  jobsData: [],
  job: {},
  jobLoadingCounter: 0,
  jobFunc: {},
  jobRuns: [],
  jobs: [],
  logs: {
    loading: false,
    error: null
  },
  loading: false,
  error: null,
  newJob: {
    task: {
      spec: {
        parameters: {},
        inputs: {},
        hyperparams: {},
        hyper_param_options: {
          strategy: 'list',
          param_file: '',
          selector: {
            criteria: 'max',
            result: ''
          }
        },
        secret_sources: []
      }
    },
    function: {
      metadata: {
        credentials: {
          access_key: ''
        }
      },
      spec: {
        env: [],
        node_selector: {},
        preemption_mode: '',
        priority_class_name: '',
        volume_mounts: [],
        volumes: []
      }
    }
  },
  scheduled: []
}

const generateRequestParams = (filters, jobName) => {
  const params = {
    iter: false
  }

  if (filters?.[TYPE_FILTER] && filters[TYPE_FILTER] !== FILTER_ALL_ITEMS) {
    params.label = [`kind=${filters[TYPE_FILTER]}`]
  }

  if (filters?.[LABELS_FILTER]) {
    const labelList = filters[LABELS_FILTER].split(',')

    if (!params.label || labelList.some(label => label.startsWith('kind='))) {
      params.label = labelList
    } else {
      params.label = params.label.concat(labelList)
    }
  }

  if (jobName) {
    params.name = jobName
  } else if (filters?.[NAME_FILTER]) {
    params.name = `~${filters[NAME_FILTER]}`
  }

  if (
    filters?.[STATUS_FILTER] &&
    filters[STATUS_FILTER] !== FILTER_ALL_ITEMS &&
    !filters[STATUS_FILTER].includes(FILTER_ALL_ITEMS)
  ) {
    params.state = filters[STATUS_FILTER]
  }

  if (filters?.[DATES_FILTER]) {
    if (filters[DATES_FILTER].value[0]) {
      params.start_time_from = filters[DATES_FILTER].value[0].toISOString()
    }

    if (filters[DATES_FILTER].value[1] && !filters[DATES_FILTER].isPredefined) {
      params.start_time_to = filters[DATES_FILTER].value[1].toISOString()
    }
  }

  return params
}

export const abortJob = createAsyncThunk('abortJob', ({ projectName, job }) => {
  return jobsApi.abortJob(projectName, job.uid, job.iteration).then(response => {
    return get(response, 'data', {})
  })
})
export const deleteAllJobRuns = createAsyncThunk('deleteAllJobRuns', ({ project, job }) => {
  return jobsApi.deleteAllJobRuns(project, job.name)
})
export const deleteJob = createAsyncThunk('deleteJob', ({ project, job }) => {
  return jobsApi.deleteJob(project, job.uid)
})
export const editJob = createAsyncThunk('editJob', ({ postData, project }) => {
  return jobsApi.editJob(postData, project)
})
export const fetchAllJobRuns = createAsyncThunk(
  'fetchAllJobRuns',
  ({ project, filters, config, jobName }, thunkAPI) => {
    const newConfig = {
      ...config,
      params: {
        ...config?.params,
        ...generateRequestParams(filters, jobName)
      }
    }

    config?.ui?.setRequestErrorMessage?.('')

    return jobsApi
      .getAllJobRuns(project, newConfig)
      .then(({ data }) => {
        return data
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch jobs',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)
export const fetchJob = createAsyncThunk('fetchJob', ({ project, jobId, iter }) => {
  return jobsApi.getJob(project, jobId, iter).then(res => {
    return res.data.data
  })
})
export const fetchJobFunction = createAsyncThunk(
  'fetchJobFunction',
  ({ project, functionName, hash }, thunkAPI) => {
    return functionsApi
      .getFunction(project, functionName, hash)
      .then(res => {
        return res.data.func
      })
      .catch(error => {
        showErrorNotification(thunkAPI.dispatch, error, 'Job’s function failed to load')
      })
  }
)
export const fetchJobFunctions = createAsyncThunk('fetchJobFunctions', ({ project, hash }) => {
  return functionsApi.getFunctions(project, null, {}, hash).then(res => {
    return res.data?.funcs
  })
})
export const fetchJobLogs = createAsyncThunk('fetchJobLogs', ({ id, project }) => {
  return jobsApi.getJobLogs(id, project).then(result => {
    return result
  })
})
export const fetchJobs = createAsyncThunk('fetchJobs', ({ project, filters, config }, thunkAPI) => {
  config?.ui?.setRequestErrorMessage?.('')

  const newConfig = {
    ...config,
    params: {
      ...config?.params,
      ...generateRequestParams(filters)
    }
  }

  return jobsApi
    .getJobs(project, newConfig)
    .then(({ data }) => {
      thunkAPI.dispatch(jobsSlice.actions.setJobsData({ jobs: data.runs || [] }))

      return data
    })
    .catch(error => {
      largeResponseCatchHandler(
        error,
        'Failed to fetch jobs',
        thunkAPI.dispatch,
        config?.ui?.setRequestErrorMessage
      )
    })
})
export const fetchScheduledJobs = createAsyncThunk(
  'fetchScheduledJobs',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    const newConfig = {
      ...config,
      params: {
        ...config?.params,
        include_last_run: 'yes'
      }
    }

    if (filters?.owner) {
      newConfig.params.owner = filters.owner
    }

    if (filters?.name) {
      newConfig.params.name = `~${filters.name}`
    }

    if (filters?.labels) {
      newConfig.params.label = filters.labels?.split(',')
    }

    return jobsApi
      .getScheduledJobs(project, newConfig)
      .then(({ data }) => {
        return (data || {}).schedules
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch scheduled jobs',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)
export const fetchSpecificJobs = createAsyncThunk(
  'fetchSpecificJobs',
  ({ project, filters, jobList }) => {
    const params = {
      ...generateRequestParams(filters)
    }

    return jobsApi.getSpecificJobs(project, params, jobList).then(({ data }) => {
      return data.runs
    })
  }
)
export const handleRunScheduledJob = createAsyncThunk(
  'handleRunScheduledJob',
  ({ postData, project, job }) => {
    return jobsApi.runScheduledJob(postData, project, job)
  }
)
export const removeScheduledJob = createAsyncThunk(
  'removeScheduledJob',
  ({ projectName, scheduleName }) => {
    return jobsApi.removeScheduledJob({ projectName, scheduleName })
  }
)
export const runNewJob = createAsyncThunk('runNewJob', ({ postData }, thunkAPI) => {
  return jobsApi
    .runJob(postData)
    .then(result => result)
    .catch(error => thunkAPI.rejectWithValue(error))
})

const jobsSlice = createSlice({
  name: 'jobsStore',
  initialState,
  reducers: {
    removeJobFunction(state) {
      state.jobFunc = {}
    },
    setJobsData(state, action) {
      state.jobsData = action.payload
    },
    setJobFunction(state, action) {
      state.jobFunc = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(abortJob.pending, showLoading)
    builder.addCase(abortJob.fulfilled, hideLoading)
    builder.addCase(abortJob.rejected, hideLoading)
    builder.addCase(deleteAllJobRuns.pending, showLoading)
    builder.addCase(deleteAllJobRuns.fulfilled, hideLoading)
    builder.addCase(deleteAllJobRuns.rejected, hideLoading)
    builder.addCase(deleteJob.pending, showLoading)
    builder.addCase(deleteJob.fulfilled, hideLoading)
    builder.addCase(deleteJob.rejected, hideLoading)
    builder.addCase(editJob.pending, showLoading)
    builder.addCase(editJob.fulfilled, hideLoading)
    builder.addCase(editJob.rejected, hideLoading)
    builder.addCase(fetchAllJobRuns.pending, showLoading)
    builder.addCase(fetchAllJobRuns.fulfilled, (state, action) => {
      state.error = null
      state.jobRuns = action.payload
      state.loading = false
    })
    builder.addCase(fetchAllJobRuns.rejected, hideLoading)
    builder.addCase(fetchJob.pending, (state, action) => {
      state.jobLoadingCounter++
    })
    builder.addCase(fetchJob.fulfilled, (state, action) => {
      state.error = null
      state.job = action.payload
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJob.rejected, (state, action) => {
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJobFunction.pending, (state, action) => {
      state.jobLoadingCounter++
    })
    builder.addCase(fetchJobFunction.fulfilled, (state, action) => {
      state.error = null
      state.jobFunc = action.payload
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJobFunction.rejected, (state, action) => {
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJobFunctions.rejected, (state, action) => {
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJobFunctions.pending, (state, action) => {
      state.jobLoadingCounter++
    })
    builder.addCase(fetchJobFunctions.fulfilled, (state, action) => {
      state.error = null
      state.jobFunc = action.payload
      state.jobLoadingCounter--
    })
    builder.addCase(fetchJobLogs.pending, (state, action) => {
      state.logs.loading = true
      state.logs.error = null
    })
    builder.addCase(fetchJobLogs.fulfilled, (state, action) => {
      state.logs.error = null
      state.logs.loading = false
    })
    builder.addCase(fetchJobLogs.rejected, (state, action) => {
      state.logs.loading = false
      state.logs.error = action.payload
    })
    builder.addCase(fetchJobs.pending, showLoading)
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.error = null
      state.jobs = action.payload
      state.loading = false
    })
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.error = action.payload
      state.jobs = []
      state.loading = false
    })
    builder.addCase(fetchScheduledJobs.pending, showLoading)
    builder.addCase(fetchScheduledJobs.fulfilled, (state, action) => {
      state.error = null
      state.scheduled = action.payload
      state.loading = false
    })
    builder.addCase(fetchScheduledJobs.rejected, (state, action) => {
      state.error = action.payload
      state.scheduled = []
      state.loading = false
    })
    builder.addCase(removeScheduledJob.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(runNewJob.pending, showLoading)
    builder.addCase(runNewJob.fulfilled, (state, action) => {
      state.error = null
      state.loading = false
    })
    builder.addCase(runNewJob.rejected, (state, action) => {
      state.error = getNewJobErrorMsg(action.payload)
      state.loading = false
    })
  }
})

export const { removeJobFunction, setJobsData, setJobFunction } = jobsSlice.actions

export default jobsSlice.reducer
