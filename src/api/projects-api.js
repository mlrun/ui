import { mainHttpClient } from '../httpClient'

export default {
  createProject: postData => mainHttpClient.post('/project', postData),
  getJobsAndWorkflows: project =>
    mainHttpClient.get(`/runs?project=${project}`),
  getProject: project => mainHttpClient.get(`/project/${project}`),
  getProjectDataSets: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=dataset`),
  getProjectFiles: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=other`),
  getProjectFunctions: project =>
    mainHttpClient.get(`/funcs?project=${project}`),
  getProjectModels: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=model`),
  getProjects: () => mainHttpClient.get('/projects?full=yes'),
  updateProject: (project, data) =>
    mainHttpClient.post(`/project/${project}`, data)
}
