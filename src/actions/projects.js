import projectsApi from '../api/projects-api'

const projectsAction = {
  fetchProjects: () => dispatch => {
    return projectsApi
      .getProjects()
      .then(response => {
        dispatch(projectsAction.setProjects(response.data.projects))
      })
      .catch(err => {
        dispatch(projectsAction.setProjectsError(err))
      })
  },
  setProjects: projects => ({
    type: 'SET_PROJECTS',
    payload: projects
  }),
  setProjectsError: err => ({
    type: 'PROJECTS_ERROR',
    payload: err
  })
}

export default projectsAction
