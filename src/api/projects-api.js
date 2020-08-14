import { mainHttpClient } from '../httpClient'

export default {
  getProjects: () => mainHttpClient.get('/projects?full=yes'),
  createProject: postData => mainHttpClient.post('/project', postData),
  getProject: project => mainHttpClient.get(`/project/${project}`),
  updateProject: (project, data) =>
    mainHttpClient.post(`/project/${project}`, data),
  getJobsAndWorkflows: project =>
    mainHttpClient.get(`/runs?project=${project}`),
  getProjectFunctions: project =>
    mainHttpClient.get(`/funcs?project=${project}`)
}
