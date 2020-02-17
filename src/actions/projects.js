import projectsApi from '../api/projects-api'

const projectsAction = {
  fetchProjects: () => dispatch => {
    return projectsApi.getProjects().then(response => {
      dispatch(projectsAction.setProjects(response.data.projects))
    })
  },
  setProjects: projects => ({
    type: 'SET_PROJECTS',
    payload: projects
  })
}

export default projectsAction
