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
  ADD_PROJECT_LABEL,
  FETCH_PROJECT_BEGIN,
  FETCH_PROJECT_COUNTERS_SUCCESS,
  FETCH_PROJECT_COUNTERS_BEGIN,
  FETCH_PROJECT_COUNTERS_FAILURE,
  FETCH_PROJECT_DATASETS_BEGIN,
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
  REMOVE_NEW_PROJECT,
  REMOVE_NEW_PROJECT_ERROR,
  REMOVE_PROJECT_COUNTERS,
  REMOVE_PROJECT_DATA,
  REMOVE_PROJECTS,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME,
  SET_PROJECT_LABELS,
  FETCH_PROJECT_FEATURE_SETS_BEGIN,
  FETCH_PROJECT_FEATURE_SETS_SUCCESS,
  FETCH_PROJECT_FEATURE_SETS_FAILURE,
  FETCH_PROJECTS_SUMMARY_BEGIN,
  FETCH_PROJECTS_SUMMARY_FAILURE,
  FETCH_PROJECTS_SUMMARY_SUCCESS,
  FETCH_PROJECTS_NAMES_BEGIN,
  FETCH_PROJECTS_NAMES_FAILURE,
  FETCH_PROJECTS_NAMES_SUCCESS,
  SET_PROJECT_DATA,
  SET_PROJECT_SETTINGS,
  SET_PROJECT_PARAMS,
  FETCH_PROJECT_SECRETS_BEGIN,
  FETCH_PROJECT_SECRETS_FAILURE,
  FETCH_PROJECT_SECRETS_SUCCESS,
  SET_PROJECT_SECRETS
} from '../constants'

const initialState = {
  error: null,
  loading: false,
  newProject: {
    name: '',
    description: '',
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
  projectCounters: {
    error: null,
    loading: false,
    data: []
  },
  projectsNames: {
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

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_PROJECT_LABEL:
      return {
        ...state,
        project: {
          ...state.project,
          data: {
            ...state.project.data,
            metadata: {
              ...state.project.data.metadata,
              labels: {
                ...payload
              }
            }
          }
        }
      }
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
          ...state.newProject,
          error: payload
        }
      }
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        newProject: {
          ...state.newProject,
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
          data: null,
          error: null,
          loading: false,
          dataSets: {
            data: null,
            error: null,
            loading: false
          },
          failedJobs: {
            data: [],
            error: null,
            loading: false
          },
          featureSets: {
            data: null,
            error: null,
            loading: false
          },
          files: {
            data: null,
            error: null,
            loading: false
          },
          jobs: {
            data: null,
            error: null,
            loading: false
          },
          functions: {
            data: null,
            error: null,
            loading: false
          },
          models: {
            data: [],
            error: null,
            loading: false
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
          workflows: {
            data: [],
            error: null,
            loading: false
          }
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
          loading: false
        }
      }
    case FETCH_PROJECT_COUNTERS_BEGIN:
      return {
        ...state,
        projectCounters: {
          ...state.projectCounters,
          loading: true
        }
      }
    case FETCH_PROJECT_COUNTERS_FAILURE:
      return {
        ...state,
        projectCounters: {
          data: [],
          loading: false,
          error: payload
        }
      }
    case FETCH_PROJECT_COUNTERS_SUCCESS:
      return {
        ...state,
        projectCounters: {
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
    case REMOVE_NEW_PROJECT:
      return {
        ...state,
        newProject: {
          name: '',
          description: ''
        }
      }
    case REMOVE_PROJECT_COUNTERS:
      return {
        ...state,
        projectCounters: {
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
          ...state.newProject,
          error: null
        }
      }
    case SET_NEW_PROJECT_DESCRIPTION:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          description: payload
        }
      }
    case SET_NEW_PROJECT_NAME:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          name: payload
        }
      }
    case SET_PROJECT_DATA: {
      return {
        ...state,
        project: payload
      }
    }
    case SET_PROJECT_LABELS: {
      return {
        ...state,
        project: {
          ...state.project,
          data: {
            ...state.project.data,
            metadata: {
              ...state.project.data.metadata,
              labels: {
                ...payload
              }
            }
          }
        }
      }
    }
    case SET_PROJECT_PARAMS: {
      return {
        ...state,
        project: {
          ...state.project,
          data: {
            ...state.project.data,
            spec: {
              ...state.project.data.spec,
              params: payload
            }
          }
        }
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
    case SET_PROJECT_SETTINGS: {
      return {
        ...state,
        project: {
          ...state.project,
          data: {
            ...state.project.data,
            spec: {
              ...state.project.data.spec,
              artifact_path: payload.artifact_path,
              source: payload.source
            }
          }
        }
      }
    }
    default:
      return state
  }
}
