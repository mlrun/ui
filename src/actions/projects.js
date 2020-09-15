import projectsApi from '../api/projects-api'
import {
  CREATE_PROJECT_BEGIN,
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECT_BEGIN,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_FUNCTIONS_BEGIN,
  FETCH_PROJECT_FUNCTIONS_FAILURE,
  FETCH_PROJECT_FUNCTIONS_SUCCESS,
  FETCH_PROJECT_JOBS_BEGIN,
  FETCH_PROJECT_JOBS_FAILURE,
  FETCH_PROJECT_JOBS_SUCCESS,
  FETCH_PROJECT_SUCCESS,
  REMOVE_NEW_PROJECT,
  REMOVE_PROJECT_DATA,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME
} from '../constants'

const projectsAction = {
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
  fetchProject: project => dispatch => {
    dispatch(projectsAction.fetchProjectBegin())

    projectsApi
      .getProject(project)
      .then(({ data }) => {
        dispatch(projectsAction.fetchProjectSuccess(data.project))
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFailure(error.message))
      })
  },
  fetchProjectJobs: project => dispatch => {
    dispatch(projectsAction.fetchProjectJobsBegin())

    projectsApi
      .getJobsAndWorkflows(project)
      .then(({ data }) => {
        dispatch(projectsAction.fetchProjectJobsSuccess(data.runs))
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectJobsFailure(error.message))
      })
  },
  fetchProjectFunctions: project => dispatch => {
    dispatch(projectsAction.fetchProjectFunctionsBegin())

    projectsApi
      .getProjectFunctions(project)
      .then(({ data }) => {
        dispatch(projectsAction.fetchProjectFunctionsSuccess(data.funcs))
      })
      .catch(error => {
        dispatch(projectsAction.fetchProjectFunctionsFailure(error.message))
      })
  },
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
  fetchProjectBegin: () => ({ type: FETCH_PROJECT_BEGIN }),
  fetchProjectJobsBegin: () => ({ type: FETCH_PROJECT_JOBS_BEGIN }),
  fetchProjectFunctionsBegin: () => ({ type: FETCH_PROJECT_FUNCTIONS_BEGIN }),
  fetchProjectsFailure: error => ({
    type: FETCH_PROJECTS_FAILURE,
    payload: error
  }),
  fetchProjectFailure: error => ({
    type: FETCH_PROJECT_FAILURE,
    payload: error
  }),
  fetchProjectJobsFailure: error => ({
    type: FETCH_PROJECT_JOBS_FAILURE,
    payload: error
  }),
  fetchProjectFunctionsFailure: error => ({
    type: FETCH_PROJECT_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchProjectsSuccess: projectsList => ({
    type: FETCH_PROJECTS_SUCCESS,
    payload: projectsList
  }),
  fetchProjectSuccess: project => ({
    type: FETCH_PROJECT_SUCCESS,
    payload: project
  }),
  fetchProjectJobsSuccess: jobs => ({
    type: FETCH_PROJECT_JOBS_SUCCESS,
    payload: jobs
  }),
  fetchProjectFunctionsSuccess: functions => ({
    type: FETCH_PROJECT_FUNCTIONS_SUCCESS,
    payload: functions
  }),
  removeNewProject: () => ({ type: REMOVE_NEW_PROJECT }),
  removeProjectData: () => ({ type: REMOVE_PROJECT_DATA }),
  setNewProjectDescription: description => ({
    type: SET_NEW_PROJECT_DESCRIPTION,
    payload: description
  }),
  setNewProjectName: name => ({ type: SET_NEW_PROJECT_NAME, payload: name })
}

export default projectsAction
