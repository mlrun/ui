import projectsApi from '../api/projects-api'
import {
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS
} from '../constants'
import { handleErrors } from '../utils/handleErrors'

const projectsAction = {
  fetchProjects: () => dispatch => {
    dispatch(projectsAction.fetchProjectsBegin())

    return projectsApi
      .getProjects()
      .then(handleErrors)
      .then(response => {
        dispatch(projectsAction.fetchProjectsSuccess(response.data.projects))
      })
      .catch(() => dispatch(projectsAction.fetchProjectsFailure()))
  },
  fetchProjectsBegin: () => ({
    type: FETCH_PROJECTS_BEGIN
  }),
  fetchProjectsSuccess: artifactsList => ({
    type: FETCH_PROJECTS_SUCCESS,
    payload: artifactsList
  }),
  fetchProjectsFailure: error => ({
    type: FETCH_PROJECTS_FAILURE,
    payload: error
  })
}

export default projectsAction
