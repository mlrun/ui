import { mainHttpClient } from '../httpClient'

export default {
  createProject: postData => mainHttpClient.post('/project', postData),
  deleteProject: project => mainHttpClient.delete(`/projects/${project}`),
  getJobsAndWorkflows: project =>
    mainHttpClient.get(`/runs?project=${project}`),
  getProject: project => mainHttpClient.get(`/project/${project}`),
  getProjectDataSets: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=dataset`),
  getProjectFailedJobs: project =>
    mainHttpClient.get(
      `/runs?project=${project}&state=error&start_time_from=${new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString()}`
    ),
  getProjectFiles: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=other`),
  getProjectFunctions: project =>
    mainHttpClient.get(`/funcs?project=${project}`),
  getProjectModels: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=model`),
  getProjectRunningJobs: project =>
    mainHttpClient.get(`/runs?project=${project}&state=running`),
  getProjects: () => mainHttpClient.get('/projects?full=yes'),
  updateProject: (project, data) =>
    mainHttpClient.post(`/project/${project}`, data)
}
