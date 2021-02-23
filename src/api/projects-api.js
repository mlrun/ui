import { mainHttpClient } from '../httpClient'

export default {
  changeProjectState: (project, state) =>
    mainHttpClient.patch(`/projects/${project}`, {
      spec: { desired_state: state }
    }),
  createProject: postData => mainHttpClient.post('/projects', postData),
  deleteProject: (project, deleteNonEmpty) =>
    mainHttpClient.delete(
      `/projects/${project}`,
      deleteNonEmpty && {
        headers: {
          'x-mlrun-deletion-strategy': 'cascade'
        }
      }
    ),
  editProjectLabels: (project, data) =>
    mainHttpClient.put(`/projects/${project}`, data),
  getJobsAndWorkflows: project =>
    mainHttpClient.get(`/runs?project=${project}`),
  getProject: project => mainHttpClient.get(`/projects/${project}`),
  getProjectDataSets: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=dataset`),
  getProjectFailedJobs: project =>
    mainHttpClient.get(
      `/runs?project=${project}&state=error&start_time_from=${new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString()}`
    ),
  getProjectFeatureSets: project =>
    mainHttpClient.get(`/projects/${project}/feature-sets`),
  getProjectFiles: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=other`),
  getProjectFunctions: project =>
    mainHttpClient.get(`/funcs?project=${project}`),
  getProjectModels: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=model`),
  getProjectRunningJobs: project =>
    mainHttpClient.get(`/runs?project=${project}&state=running`),
  getProjectScheduledJobs: project =>
    mainHttpClient.get(`/projects/${project}/schedules`),
  getProjects: () => mainHttpClient.get('/projects'),
  getProjectWorkflows: project => {
    return mainHttpClient.get(`/projects/${project}/pipelines`)
  },
  updateProject: (project, data) =>
    mainHttpClient.patch(`/projects/${project}`, data)
}
