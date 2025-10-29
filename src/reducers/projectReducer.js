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

import nuclioApi from '../api/nuclio'
import projectsApi from '../api/projects-api'
import { hideLoading, showLoading } from './redux.util'

import { DEFAULT_ABORT_MSG, PROJECT_ONLINE_STATUS, REQUEST_CANCELED } from '../constants'
import { parseProjects } from '../utils/parseProjects'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { parseSummaryData } from '../utils/parseSummaryData'
import { mlrunUnhealthyErrors } from '../components/ProjectsPage/projects.util'
import { aggregateApplicationStatuses, splitApplicationsContent } from '../utils/applications.utils'

const initialState = {
  deletingProjects: {},
  projectsToDelete: [],
  error: null,
  jobsMonitoringData: {
    jobs: {},
    workflows: {},
    scheduled: {},
    alerts: {}
  },
  loading: false,
  newProject: {
    error: null
  },
  mlrunUnhealthy: {
    isUnhealthy: false,
    retrying: false
  },
  accessibleProjectsMap: {},
  project: {
    data: null,
    error: null,
    isDeletingBegun: false,
    dataSets: {
      data: null,
      loading: false,
      error: null
    },
    failedJobs: {
      data: [],
      error: null,
      loading: false
    },
    featureSets: {
      data: null,
      loading: false,
      error: null
    },
    files: {
      data: null,
      loading: false,
      error: null
    },
    functions: {
      data: [],
      loading: false,
      error: null
    },
    jobs: {
      data: [],
      error: null,
      loading: false
    },
    loading: false,
    models: {
      data: [],
      loading: false,
      error: null
    },
    runningJobs: {
      data: [],
      error: null,
      loading: false
    },
    scheduledJobs: {
      data: [],
      error: null,
      loading: false
    },
    secrets: {
      data: {},
      error: null,
      loading: false
    },
    workflows: {
      data: [],
      error: null,
      loading: false
    }
  },
  projectTotalAlerts: {},
  projects: [],
  projectsNames: {
    error: null,
    loading: false,
    data: []
  },
  projectSummary: {
    error: null,
    loading: false,
    data: []
  },
  projectsSummary: {
    error: null,
    loading: false,
    data: []
  }
}

export const changeProjectState = createAsyncThunk(
  'changeProjectState',
  ({ project, status }, thunkAPI) => {
    return projectsApi
      .changeProjectState(project, status)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const createNewProject = createAsyncThunk('createNewProject', ({ postData }, thunkAPI) => {
  return projectsApi
    .createProject(postData)
    .then(result => {
      return result.data
    })
    .catch(error => {
      return thunkAPI.rejectWithValue(error)
    })
})
export const deleteProject = createAsyncThunk(
  'deleteProject',
  ({ projectName, deleteNonEmpty }, thunkAPI) => {
    return projectsApi
      .deleteProject(projectName, deleteNonEmpty)
      .then(response => {
        return { response, projectName }
      })
      .catch(error => thunkAPI.rejectWithValue({ error, projectName }))
  }
)

export const fetchProject = createAsyncThunk(
  'fetchProject',
  ({ project, params, signal }, thunkAPI) => {
    return projectsApi
      .getProject(project, params, signal)
      .then(response => {
        return response
      })
      .catch(error => {
        if (![REQUEST_CANCELED, DEFAULT_ABORT_MSG].includes(error.message)) {
          return thunkAPI.rejectWithValue(error)
        }
      })
  }
)
export const fetchProjectDataSets = createAsyncThunk(
  'fetchProjectDataSets',
  ({ project }, thunkAPI) => {
    return projectsApi
      .getProjectDataSets(project)
      .then(response => {
        return response?.data.artifacts
      })
      .catch(error => thunkAPI.rejectWithValue(error.message))
  }
)
export const fetchProjectFailedJobs = createAsyncThunk(
  'fetchProjectFailedJobs',
  ({ project, signal }, thunkAPI) => {
    return projectsApi
      .getProjectFailedJobs(project, signal)
      .then(response => {
        return response?.data.runs
      })
      .catch(error => thunkAPI.rejectWithValue(error.message))
  }
)
export const fetchProjectFunctions = createAsyncThunk(
  'fetchProjectFunctions',
  ({ project, signal }, thunkAPI) => {
    return projectsApi
      .getProjectFunctions(project, signal)
      .then(response => {
        return response?.data.funcs
      })
      .catch(error => thunkAPI.rejectWithValue(error.message))
  }
)
export const fetchProjectJobs = createAsyncThunk(
  'fetchProjectJobs',
  ({ project, startTimeFrom, signal }, thunkAPI) => {
    const params = {
      'partition-by': 'name',
      'partition-sort-by': 'updated',
      'rows-per-partition': '5',
      'max-partitions': '5',
      iter: 'false',
      start_time_from: startTimeFrom
    }

    return projectsApi
      .getJobsAndWorkflows(project, params, signal)
      .then(response => {
        return response?.data.runs
      })
      .catch(error => thunkAPI.rejectWithValue(error.message))
  }
)
export const fetchProjectSecrets = createAsyncThunk(
  'fetchProjectSecrets',
  ({ project }, thunkAPI) => {
    return projectsApi.getProjectSecrets(project).catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchProjectSummary = createAsyncThunk(
  'fetchProjectSummary',
  ({ project, signal }, thunkAPI) => {
    return Promise.all([
      projectsApi.getProjectSummary(project, signal),
      nuclioApi.getFunctions(project)
    ])
      .then(([projectSummary, nuclioFunctions]) => {
        const parsedProjectSummary = parseSummaryData(projectSummary.data)
        const { ready: runningAppsNumber, error: failedAppsNumber } = aggregateApplicationStatuses(
          splitApplicationsContent(nuclioFunctions.data).applications
        )

        return {
          ...parsedProjectSummary,
          running_model_monitoring_functions:
            runningAppsNumber ?? parsedProjectSummary.running_model_monitoring_functions,
          failed_model_monitoring_functions:
            failedAppsNumber ?? parsedProjectSummary.failed_model_monitoring_functions
        }
      })
      .catch(error => {
        if (![REQUEST_CANCELED, DEFAULT_ABORT_MSG].includes(error.message)) {
          return thunkAPI.rejectWithValue(error)
        }
      })
  }
)
export const fetchProjects = createAsyncThunk(
  'fetchProjects',
  ({ params, setRequestErrorMessage = () => {}, showNotification = true }, thunkAPI) => {
    setRequestErrorMessage('')

    return projectsApi
      .getProjects(params)
      .then(response => {
        return parseProjects(response.data.projects)
      })
      .catch(error => {
        if (showNotification) {
          showErrorNotification(thunkAPI.dispatch, error, null, null, null, setRequestErrorMessage)
        }

        return thunkAPI.rejectWithValue(error)
      })
  }
)
export const fetchProjectsNames = createAsyncThunk('fetchProjectsNames', (_, thunkAPI) => {
  return projectsApi
    .getProjects({ format: 'name_only', state: PROJECT_ONLINE_STATUS })
    .then(({ data: { projects } }) => {
      return projects
    })
    .catch(error => {
      showErrorNotification(thunkAPI.dispatch, error)

      return thunkAPI.rejectWithValue(error)
    })
})

let firstServerErrorTimestamp = null

export const fetchProjectsSummary = createAsyncThunk(
  'fetchProjectsSummary',
  ({ signal, refresh }, thunkAPI) => {
    return projectsApi
      .getProjectSummaries(signal)
      .then(({ data: { project_summaries } }) => {
        if (firstServerErrorTimestamp && refresh) {
          firstServerErrorTimestamp = null

          refresh()
        }

        thunkAPI.dispatch(setMlrunIsUnhealthy(false))
        thunkAPI.dispatch(setMlrunUnhealthyRetrying(false))

        return parseSummaryData(project_summaries)
      })
      .catch(err => {
        if (mlrunUnhealthyErrors.includes(err.response?.status)) {
          if (!firstServerErrorTimestamp) {
            firstServerErrorTimestamp = new Date()

            thunkAPI.dispatch(setMlrunUnhealthyRetrying(true))
          }

          const threeMinutesPassed = (new Date() - firstServerErrorTimestamp) / 1000 > 180

          if (!threeMinutesPassed) {
            setTimeout(() => {
              thunkAPI.dispatch(fetchProjectsSummary({ signal, refresh }))
            }, 3000)
          }

          if (threeMinutesPassed) {
            thunkAPI.dispatch(setMlrunIsUnhealthy(true))
            thunkAPI.dispatch(setMlrunUnhealthyRetrying(true))
          }
        }

        return thunkAPI.rejectWithValue(err)
      })
  }
)

const projectStoreSlice = createSlice({
  name: 'projectStore',
  initialState,
  reducers: {
    removeNewProjectError(state) {
      state.newProject.error = null
    },
    removeProjectData(state) {
      state.project = initialState.project
    },
    removeProjectSummary(state) {
      state.projectSummary = {
        error: null,
        loading: false,
        data: []
      }
    },
    removeProjects(state) {
      state.projects = []
    },
    setDeletingProjects(state, action) {
      state.deletingProjects = { ...action.payload }
    },
    setMlrunIsUnhealthy(state, action) {
      state.mlrunUnhealthy.isUnhealthy = action.payload
    },
    setMlrunUnhealthyRetrying(state, action) {
      state.mlrunUnhealthy.retrying = action.payload
    },
    setJobsMonitoringData(state, action) {
      state.jobsMonitoringData = action.payload
    },
    setProjectTotalAlerts(state, action) {
      state.projectTotalAlerts = { ...action.payload }
    },
    setAccessibleProjectsMap(state, action) {
      state.accessibleProjectsMap = {
        ...state.accessibleProjectsMap,
        ...action.payload
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(changeProjectState.pending, showLoading)
    builder.addCase(changeProjectState.fulfilled, hideLoading)
    builder.addCase(changeProjectState.rejected, hideLoading)
    builder.addCase(createNewProject.pending, showLoading)
    builder.addCase(createNewProject.fulfilled, state => {
      state.newProject.error = null
      state.loading = false
    })
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.newProject.error = action.payload
      state.loading = false
    })
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.projectsToDelete = state.projectsToDelete.filter(
        projectName => projectName !== action.payload.projectName
      )
    })
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.projectsToDelete = state.projectsToDelete.filter(
        projectName => projectName !== action.payload.projectName
      )
    })
    builder.addCase(fetchProject.pending, state => {
      state.project.loading = true
    })
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.project = {
        ...state.project,
        error: null,
        loading: false,
        data: action.payload?.data
      }
    })
    builder.addCase(fetchProject.rejected, (state, action) => {
      state.project.error = action.payload
      state.project.loading = false
    })
    builder.addCase(fetchProjectDataSets.pending, state => {
      state.project.dataSets.loading = true
    })
    builder.addCase(fetchProjectDataSets.fulfilled, (state, action) => {
      state.project.dataSets = {
        data: action.payload,
        loading: false,
        error: null
      }
    })
    builder.addCase(fetchProjectDataSets.rejected, (state, action) => {
      state.project.dataSets = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
    builder.addCase(fetchProjectFailedJobs.pending, state => {
      state.project.failedJobs.loading = true
    })
    builder.addCase(fetchProjectFailedJobs.fulfilled, (state, action) => {
      state.project.failedJobs = {
        data: action.payload,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectFailedJobs.rejected, (state, action) => {
      state.project.failedJobs = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
    builder.addCase(fetchProjectFunctions.pending, state => {
      state.project.functions.loading = true
    })
    builder.addCase(fetchProjectFunctions.fulfilled, (state, action) => {
      state.project.functions = {
        data: action.payload,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectFunctions.rejected, (state, action) => {
      state.project.functions = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
    builder.addCase(fetchProjectJobs.pending, state => {
      state.project.jobs.loading = true
    })
    builder.addCase(fetchProjectJobs.fulfilled, (state, action) => {
      state.project.jobs = {
        data: action.payload.filter(job => job.metadata.iteration === 0),
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectJobs.rejected, (state, action) => {
      state.project.jobs = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
    builder.addCase(fetchProjectSecrets.pending, state => {
      state.project.secrets.loading = true
    })
    builder.addCase(fetchProjectSecrets.fulfilled, (state, action) => {
      state.project.secrets = {
        data: action.payload.data,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectSecrets.rejected, (state, action) => {
      state.project.secrets = {
        data: [],
        error: action.payload.message,
        loading: false
      }
    })
    builder.addCase(fetchProjectSummary.pending, state => {
      state.projectSummary.loading = true
    })
    builder.addCase(fetchProjectSummary.fulfilled, (state, action) => {
      state.projectSummary = {
        data: action.payload,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectSummary.rejected, (state, action) => {
      state.projectSummary = {
        data: [],
        error: action.payload.message,
        loading: false
      }
    })
    builder.addCase(fetchProjects.pending, showLoading)
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects = action.payload
      state.loading = false
      state.error = null
      state.projectsNames.data = action.payload
        .filter(project => project.status.state === PROJECT_ONLINE_STATUS)
        .map(project => project.metadata.name)
    })
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.projects = []
      state.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchProjectsNames.pending, state => {
      state.projectsNames.loading = true
    })
    builder.addCase(fetchProjectsNames.fulfilled, (state, action) => {
      state.projectsNames = {
        data: action.payload,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectsNames.rejected, (state, action) => {
      state.projectsNames = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
    builder.addCase(fetchProjectsSummary.pending, state => {
      state.projectsSummary.loading = true
    })
    builder.addCase(fetchProjectsSummary.fulfilled, (state, action) => {
      state.projectsSummary = {
        data: action.payload,
        error: null,
        loading: false
      }
    })
    builder.addCase(fetchProjectsSummary.rejected, (state, action) => {
      state.projectsSummary = {
        data: [],
        error: action.payload,
        loading: false
      }
    })
  }
})

export const {
  removeNewProjectError,
  removeProjectData,
  removeProjectSummary,
  removeProjects,
  setDeletingProjects,
  setMlrunIsUnhealthy,
  setMlrunUnhealthyRetrying,
  setJobsMonitoringData,
  setProjectTotalAlerts,
  setAccessibleProjectsMap
} = projectStoreSlice.actions

export default projectStoreSlice.reducer
