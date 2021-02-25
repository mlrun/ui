import projectsApi from '../api/projects-api'
import {
  ADD_PROJECT_LABEL,
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
  FETCH_PROJECT_DATASETS_FAILURE,
  FETCH_PROJECT_DATASETS_SUCCESS,
  FETCH_PROJECT_FAILED_JOBS_BEGIN,
  FETCH_PROJECT_FAILED_JOBS_FAILURE,
  FETCH_PROJECT_FAILED_JOBS_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_FEATURE_SETS_BEGIN,
  FETCH_PROJECT_FEATURE_SETS_FAILURE,
  FETCH_PROJECT_FEATURE_SETS_SUCCESS,
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
  REMOVE_PROJECT_DATA,
  REMOVE_PROJECTS,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME,
  SET_PROJECT_LABELS
} from '../constants'

const projectsAction = {
  addProjectLabel: (label, labels) => ({
    type: ADD_PROJECT_LABEL,
    payload: { ...labels, ...label }
  }),
  changeProjectState: (project, status) => dispatch => {
    dispatch(projectsAction.changeProjectStateBegin())

    return projectsApi
      .changeProjectState(project, status)
      .then(() => dispatch(projectsAction.changeProjectStateSuccess()))
      .catch(() => dispatch(projectsAction.changeProjectStateFailure()))
  },
  changeProjectStateBegin: () => ({ type: CHANGE_PROJECT_STATE_BEGIN }),
  changeProjectStateFailure: () => ({ type: CHANGE_PROJECT_STATE_FAILURE }),
  changeProjectStateSuccess: () => ({ type: CHANGE_PROJECT_STATE_SUCCESS }),
  createNewProject: postData => dispatch => {
    dispatch(projectsAction.createProjectBegin())

    return projectsApi
      .createProject(postData)
      .then(result => {
        dispatch(projectsAction.createProjectSuccess())

        return result
      })
      .catch(error => {
        dispatch(projectsAction.createProjectFailure(error.message))
      })
  },
  createProjectBegin: () => ({ type: CREATE_PROJECT_BEGIN }),
  createProjectFailure: error => ({
    type: CREATE_PROJECT_FAILURE,
    payload: error
  }),
  createProjectSuccess: () => ({ type: CREATE_PROJECT_SUCCESS }),
  deleteProject: (project, deleteNonEmpty) => dispatch => {
    dispatch(projectsAction.deleteProjectBegin())

    return projectsApi
      .deleteProject(project, deleteNonEmpty)
      .then(() => dispatch(projectsAction.deleteProjectSuccess()))
      .catch(error => {
        dispatch(projectsAction.deleteProjectFailure())

        throw error
      })
  },
  deleteProjectBegin: () => ({
    type: DELETE_PROJECT_BEGIN
  }),
  deleteProjectFailure: error => ({
    type: DELETE_PROJECT_FAILURE,
    payload: error
  }),
  deleteProjectSuccess: () => ({
    type: DELETE_PROJECT_SUCCESS
  }),
  editProjectLabels: (projectName, data, labels) => dispatch => {
    dispatch(projectsAction.setProjectLabels(labels))

    return projectsApi.editProjectLabels(projectName, { ...data })
  },
  fetchProject: project => dispatch => {
    dispatch(projectsAction.fetchProjectBegin())

    projectsApi
      .getProject(project)
      .then(response => {
        dispatch(projectsAction.fetchProjectSuccess(response?.data))
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFailure(error.message))
      })
  },
  fetchProjectBegin: () => ({ type: FETCH_PROJECT_BEGIN }),
  fetchProjectDataSets: project => dispatch => {
    dispatch(projectsAction.fetchProjectDataSetsBegin())

    return projectsApi
      .getProjectDataSets(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectDataSetsSuccess(response?.data.artifacts)
        )

        return response?.data.artifacts
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectDataSetsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectDataSetsBegin: () => ({ type: FETCH_PROJECT_DATASETS_BEGIN }),
  fetchProjectDataSetsFailure: error => ({
    type: FETCH_PROJECT_DATASETS_FAILURE,
    payload: error
  }),
  fetchProjectDataSetsSuccess: datasets => ({
    type: FETCH_PROJECT_DATASETS_SUCCESS,
    payload: datasets
  }),
  fetchProjectFailedJobs: project => dispatch => {
    dispatch(projectsAction.fetchProjectFailedJobsBegin())

    return projectsApi
      .getProjectFailedJobs(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectFailedJobsSuccess(response?.data.runs)
        )

        return response?.data.runs
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFailedJobsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectFailedJobsBegin: () => ({
    type: FETCH_PROJECT_FAILED_JOBS_BEGIN
  }),
  fetchProjectFailedJobsFailure: error => ({
    type: FETCH_PROJECT_FAILED_JOBS_FAILURE,
    payload: error
  }),
  fetchProjectFailedJobsSuccess: jobs => ({
    type: FETCH_PROJECT_FAILED_JOBS_SUCCESS,
    payload: jobs
  }),
  fetchProjectFailure: error => ({
    type: FETCH_PROJECT_FAILURE,
    payload: error
  }),
  fetchProjectFiles: project => dispatch => {
    dispatch(projectsAction.fetchProjectFilesBegin())

    projectsApi
      .getProjectFiles(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectFilesSuccess(response?.data.artifacts)
        )
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFilesFailure(error.message))
      })
  },
  fetchProjectFeatureSets: project => dispatch => {
    dispatch(projectsAction.fetchProjectFeatureSetsBegin())

    return projectsApi
      .getProjectFeatureSets(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectFeatureSetsSuccess(
            response.data?.feature_sets
          )
        )

        return response.data?.feature_sets
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFeatureSetsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectFeatureSetsBegin: () => ({
    type: FETCH_PROJECT_FEATURE_SETS_BEGIN
  }),
  fetchProjectFeatureSetsFailure: error => ({
    type: FETCH_PROJECT_FEATURE_SETS_FAILURE,
    payload: error
  }),
  fetchProjectFeatureSetsSuccess: featureSets => ({
    type: FETCH_PROJECT_FEATURE_SETS_SUCCESS,
    payload: featureSets
  }),
  fetchProjectFilesBegin: () => ({ type: FETCH_PROJECT_FILES_BEGIN }),
  fetchProjectFilesFailure: error => ({
    type: FETCH_PROJECT_FILES_FAILURE,
    payload: error
  }),
  fetchProjectFilesSuccess: files => ({
    type: FETCH_PROJECT_FILES_SUCCESS,
    payload: files
  }),
  fetchProjectFunctions: project => dispatch => {
    dispatch(projectsAction.fetchProjectFunctionsBegin())

    return projectsApi
      .getProjectFunctions(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectFunctionsSuccess(response?.data.funcs)
        )

        return response?.data.funcs
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFunctionsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectFunctionsBegin: () => ({ type: FETCH_PROJECT_FUNCTIONS_BEGIN }),
  fetchProjectFunctionsFailure: error => ({
    type: FETCH_PROJECT_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchProjectFunctionsSuccess: functions => ({
    type: FETCH_PROJECT_FUNCTIONS_SUCCESS,
    payload: functions
  }),
  fetchProjectJobs: project => dispatch => {
    dispatch(projectsAction.fetchProjectJobsBegin())

    return projectsApi
      .getJobsAndWorkflows(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectJobsSuccess(
            response?.data.runs.filter(job => job.metadata.iteration === 0)
          )
        )

        return response?.data.runs
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectJobsFailure(error.message))
      })
  },
  fetchProjectJobsBegin: () => ({ type: FETCH_PROJECT_JOBS_BEGIN }),
  fetchProjectJobsFailure: error => ({
    type: FETCH_PROJECT_JOBS_FAILURE,
    payload: error
  }),
  fetchProjectJobsSuccess: jobs => ({
    type: FETCH_PROJECT_JOBS_SUCCESS,
    payload: jobs
  }),
  fetchProjectModels: project => dispatch => {
    dispatch(projectsAction.fetchProjectModelsBegin())

    return projectsApi
      .getProjectModels(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectModelsSuccess(response?.data.artifacts)
        )

        return response?.data.artifacts
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectModelsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectModelsBegin: () => ({ type: FETCH_PROJECT_MODELS_BEGIN }),
  fetchProjectModelsFailure: error => ({
    type: FETCH_PROJECT_MODELS_FAILURE,
    payload: error
  }),
  fetchProjectModelsSuccess: models => ({
    type: FETCH_PROJECT_MODELS_SUCCESS,
    payload: models
  }),
  fetchProjectRunningJobs: project => dispatch => {
    dispatch(projectsAction.fetchProjectRunningJobsBegin())

    return projectsApi
      .getProjectRunningJobs(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectRunningJobsSuccess(response?.data.runs)
        )

        return response?.data.runs
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectRunningJobsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectRunningJobsBegin: () => ({
    type: FETCH_PROJECT_RUNNING_JOBS_BEGIN
  }),
  fetchProjectRunningJobsFailure: error => ({
    type: FETCH_PROJECT_RUNNING_JOBS_FAILURE,
    payload: error
  }),
  fetchProjectRunningJobsSuccess: jobs => ({
    type: FETCH_PROJECT_RUNNING_JOBS_SUCCESS,
    payload: jobs
  }),
  fetchProjectScheduledJobs: project => dispatch => {
    dispatch(projectsAction.fetchProjectScheduledJobsBegin())

    return projectsApi
      .getProjectScheduledJobs(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectScheduledJobsSuccess(
            response.data.schedules
          )
        )

        return response.data.schedules
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectScheduledJobsFailure(error.message))

        throw error.message
      })
  },
  fetchProjectScheduledJobsBegin: () => ({
    type: FETCH_PROJECT_SCHEDULED_JOBS_BEGIN
  }),
  fetchProjectScheduledJobsFailure: error => ({
    type: FETCH_PROJECT_SCHEDULED_JOBS_FAILURE,
    payload: error
  }),
  fetchProjectScheduledJobsSuccess: jobs => ({
    type: FETCH_PROJECT_SCHEDULED_JOBS_SUCCESS,
    payload: jobs
  }),
  fetchProjectSuccess: project => ({
    type: FETCH_PROJECT_SUCCESS,
    payload: project
  }),
  fetchProjects: () => dispatch => {
    dispatch(projectsAction.fetchProjectsBegin())

    return projectsApi
      .getProjects()
      .then(response => {
        dispatch(projectsAction.fetchProjectsSuccess(response.data.projects))

        return response.data.projects
      })
      .catch(err => {
        dispatch(projectsAction.fetchProjectsFailure(err))
      })
  },
  fetchProjectsBegin: () => ({ type: FETCH_PROJECTS_BEGIN }),
  fetchProjectsFailure: error => ({
    type: FETCH_PROJECTS_FAILURE,
    payload: error
  }),
  fetchProjectsSuccess: projectsList => ({
    type: FETCH_PROJECTS_SUCCESS,
    payload: projectsList
  }),
  fetchProjectWorkflows: project => dispatch => {
    dispatch(projectsAction.fetchProjectWorkflowsBegin())

    return projectsApi
      .getProjectWorkflows(project)
      .then(response => {
        dispatch(
          projectsAction.fetchProjectWorkflowsSuccess(response.data.runs)
        )

        return response.data.runs
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectWorkflowsFailure(error.message))
      })
  },
  fetchProjectWorkflowsBegin: () => ({
    type: FETCH_PROJECT_WORKFLOWS_BEGIN
  }),
  fetchProjectWorkflowsFailure: error => ({
    type: FETCH_PROJECT_WORKFLOWS_FAILURE,
    payload: error
  }),
  fetchProjectWorkflowsSuccess: workflows => ({
    type: FETCH_PROJECT_WORKFLOWS_SUCCESS,
    payload: workflows
  }),
  removeNewProject: () => ({ type: REMOVE_NEW_PROJECT }),
  removeNewProjectError: () => ({ type: REMOVE_NEW_PROJECT_ERROR }),
  removeProjectData: () => ({ type: REMOVE_PROJECT_DATA }),
  removeProjects: () => ({ type: REMOVE_PROJECTS }),
  setNewProjectDescription: description => ({
    type: SET_NEW_PROJECT_DESCRIPTION,
    payload: description
  }),
  setNewProjectName: name => ({ type: SET_NEW_PROJECT_NAME, payload: name }),
  setProjectLabels: labels => ({
    type: SET_PROJECT_LABELS,
    payload: { ...labels }
  })
}

export default projectsAction
