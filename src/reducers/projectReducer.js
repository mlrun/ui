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
import {
  CHANGE_PROJECT_STATE_BEGIN,
  CHANGE_PROJECT_STATE_FAILURE,
  CHANGE_PROJECT_STATE_SUCCESS,
  CREATE_PROJECT_BEGIN,
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  DELETE_PROJECT_BEGIN,
  DELETE_PROJECT_FAILURE,
  DELETE_PROJECT_SUCCESS,
  FETCH_PROJECT_BEGIN,
  FETCH_PROJECT_DATASETS_BEGIN,
  FETCH_PROJECT_SUMMARY_BEGIN,
  FETCH_PROJECT_SUMMARY_FAILURE,
  FETCH_PROJECT_SUMMARY_SUCCESS,
  FETCH_PROJECT_DATASETS_FAILURE,
  FETCH_PROJECT_DATASETS_SUCCESS,
  FETCH_PROJECT_FAILED_JOBS_BEGIN,
  FETCH_PROJECT_FAILED_JOBS_FAILURE,
  FETCH_PROJECT_FAILED_JOBS_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_FILES_BEGIN,
  FETCH_PROJECT_FILES_FAILURE,
  FETCH_PROJECT_FILES_SUCCESS,
  FETCH_PROJECT_FUNCTIONS_BEGIN,
  FETCH_PROJECT_FUNCTIONS_FAILURE,
  FETCH_PROJECT_FUNCTIONS_SUCCESS,
  FETCH_PROJECT_JOBS_BEGIN,
  FETCH_PROJECT_JOBS_FAILURE,
  FETCH_PROJECT_JOBS_SUCCESS,
  FETCH_PROJECT_MODELS_BEGIN,
  FETCH_PROJECT_MODELS_FAILURE,
  FETCH_PROJECT_MODELS_SUCCESS,
  FETCH_PROJECT_RUNNING_JOBS_BEGIN,
  FETCH_PROJECT_RUNNING_JOBS_FAILURE,
  FETCH_PROJECT_RUNNING_JOBS_SUCCESS,
  FETCH_PROJECT_SCHEDULED_JOBS_BEGIN,
  FETCH_PROJECT_SCHEDULED_JOBS_FAILURE,
  FETCH_PROJECT_SCHEDULED_JOBS_SUCCESS,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_WORKFLOWS_BEGIN,
  FETCH_PROJECT_WORKFLOWS_FAILURE,
  FETCH_PROJECT_WORKFLOWS_SUCCESS,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  REMOVE_NEW_PROJECT_ERROR,
  REMOVE_PROJECT_SUMMARY,
  REMOVE_PROJECT_DATA,
  REMOVE_PROJECTS,
  FETCH_PROJECT_FEATURE_SETS_BEGIN,
  FETCH_PROJECT_FEATURE_SETS_SUCCESS,
  FETCH_PROJECT_FEATURE_SETS_FAILURE,
  FETCH_PROJECTS_SUMMARY_BEGIN,
  FETCH_PROJECTS_SUMMARY_FAILURE,
  FETCH_PROJECTS_SUMMARY_SUCCESS,
  FETCH_PROJECTS_NAMES_BEGIN,
  FETCH_PROJECTS_NAMES_FAILURE,
  FETCH_PROJECTS_NAMES_SUCCESS,
  FETCH_PROJECT_SECRETS_BEGIN,
  FETCH_PROJECT_SECRETS_FAILURE,
  FETCH_PROJECT_SECRETS_SUCCESS,
  SET_PROJECT_SECRETS,
  SET_JOBS_MONITORING_DATA,
  REMOVE_JOBS_MONITORING_DATA_FILTERS
} from '../constants'

const initialState = {
  error: null,
  jobsMonitoringData: {
    jobs: {},
    workflows: {},
    scheduled: {},
    filters: {
      status: ''
    }
  },
  loading: false,
  newProject: {
    error: null
  },
  project: {
    data: null,
    error: null,
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
      data: null,
      loading: false,
      error: null
    },
    jobs: {
      data: null,
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

const projectReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_PROJECT_STATE_BEGIN:
      return {
        ...state,
        loading: true
      }
    case CHANGE_PROJECT_STATE_FAILURE:
      return {
        ...state,
        loading: false
      }
    case CHANGE_PROJECT_STATE_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case CREATE_PROJECT_BEGIN:
      return {
        ...state,
        loading: true
      }
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        newProject: {
          error: payload
        }
      }
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        newProject: {
          error: null
        }
      }
    case DELETE_PROJECT_BEGIN:
      return {
        ...state,
        loading: true
      }
    case DELETE_PROJECT_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        project: {
          ...initialState.project
        }
      }
    case FETCH_PROJECT_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          loading: true
        }
      }
    case FETCH_PROJECT_DATASETS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          dataSets: {
            ...state.project.dataSets,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_DATASETS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          dataSets: {
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_DATASETS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          dataSets: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_FEATURE_SETS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          featureSets: {
            ...state.project.featureSets,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_FEATURE_SETS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          featureSets: {
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_FEATURE_SETS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          featureSets: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_FAILED_JOBS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          failedJobs: {
            ...state.project.failedJobs,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_FAILED_JOBS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          failedJobs: {
            ...state.project.failedJobs,
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_FAILED_JOBS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          failedJobs: {
            ...state.project.failedJobs,
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECT_FILES_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          files: {
            ...state.project.files,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_FILES_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          files: {
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_FILES_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          files: {
            data: payload,
            loading: true,
            error: null
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            error: payload
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_JOBS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_JOBS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_JOBS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_MODELS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          models: {
            ...state.project.models,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_MODELS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          models: {
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_MODELS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          models: {
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_RUNNING_JOBS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          runningJobs: {
            ...state.project.runningJobs,
            error: null,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_RUNNING_JOBS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          runningJobs: {
            ...state.project.runningJobs,
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_RUNNING_JOBS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          runningJobs: {
            ...state.project.runningJobs,
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          data: payload,
          loading: false
        }
      }
    case FETCH_PROJECT_SCHEDULED_JOBS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          scheduledJobs: {
            ...state.project.scheduledJobs,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_SCHEDULED_JOBS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          scheduledJobs: {
            ...state.project.scheduledJobs,
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_SCHEDULED_JOBS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          scheduledJobs: {
            ...state.project.scheduledJobs,
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_SECRETS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          secrets: {
            ...state.project.secrets,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_SECRETS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          secrets: {
            ...state.project.secrets,
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_SECRETS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          secrets: {
            ...state.project.secrets,
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case FETCH_PROJECTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        loading: false,
        error: payload
      }
    case FETCH_PROJECTS_NAMES_BEGIN:
      return {
        ...state,
        projectsNames: {
          ...state.projectsNames,
          loading: true
        }
      }
    case FETCH_PROJECTS_NAMES_FAILURE:
      return {
        ...state,
        projectsNames: {
          data: [],
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECTS_NAMES_SUCCESS:
      return {
        ...state,
        projectsNames: {
          ...state.projectsNames,
          data: payload,
          loading: false
        }
      }
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: payload,
        loading: false
      }
    case FETCH_PROJECTS_SUMMARY_BEGIN:
      return {
        ...state,
        projectsSummary: {
          ...state.projectsSummary,
          loading: true
        }
      }
    case FETCH_PROJECTS_SUMMARY_FAILURE:
      return {
        ...state,
        projectsSummary: {
          data: [],
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECTS_SUMMARY_SUCCESS:
      return {
        ...state,
        projectsSummary: {
          ...state.projectsSummary,
          data: payload,
          loading: false,
          error: null
        }
      }
    case FETCH_PROJECT_SUMMARY_BEGIN:
      return {
        ...state,
        projectSummary: {
          ...state.projectSummary,
          loading: true
        }
      }
    case FETCH_PROJECT_SUMMARY_FAILURE:
      return {
        ...state,
        projectSummary: {
          data: [],
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECT_SUMMARY_SUCCESS:
      return {
        ...state,
        projectSummary: {
          data: payload,
          loading: false,
          error: null
        }
      }
    case FETCH_PROJECT_WORKFLOWS_BEGIN:
      return {
        ...state,
        project: {
          ...state.project,
          workflows: {
            ...state.project.workflows,
            loading: true
          }
        }
      }
    case FETCH_PROJECT_WORKFLOWS_FAILURE:
      return {
        ...state,
        project: {
          ...state.project,
          workflows: {
            ...state.project.workflows,
            data: [],
            error: payload,
            loading: false
          }
        }
      }
    case FETCH_PROJECT_WORKFLOWS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          workflows: {
            ...state.project.workflows,
            data: payload,
            error: null,
            loading: false
          }
        }
      }
    case REMOVE_JOBS_MONITORING_DATA_FILTERS:
      return {
        ...state,
        jobsMonitoringData: {
          ...state.jobsMonitoringData,
          filters: {
            ...initialState.jobsMonitoringData.filters
          }
        }
      }
    case REMOVE_PROJECT_SUMMARY:
      return {
        ...state,
        projectSummary: {
          error: null,
          loading: false,
          data: []
        }
      }
    case REMOVE_PROJECT_DATA:
      return {
        ...state,
        project: {
          ...initialState.project
        }
      }
    case REMOVE_PROJECTS:
      return {
        ...state,
        projects: []
      }
    case REMOVE_NEW_PROJECT_ERROR:
      return {
        ...state,
        newProject: {
          error: null
        }
      }
    case SET_JOBS_MONITORING_DATA:
      return {
        ...state,
        jobsMonitoringData: {
          ...state.jobsMonitoringData,
          ...payload
        }
      }
    case SET_PROJECT_SECRETS: {
      return {
        ...state,
        project: {
          ...state.project,
          secrets: {
            ...state.project.secrets,
            data: {
              ...state.project.secrets.data,
              secret_keys: payload
            },
            error: null,
            loading: false
          }
        }
      }
    }
    default:
      return state
  }
}

export default projectReducer
