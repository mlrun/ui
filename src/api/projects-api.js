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
  deleteSecret: (project, key) =>
    mainHttpClient.delete(
      `/projects/${project}/secrets?provider=kubernetes&secret=${key}`
    ),
  editProject: (project, data) =>
    mainHttpClient.put(`/projects/${project}`, data),
  getJobsAndWorkflows: project =>
    mainHttpClient.get(`/runs?project=${project}`),
  getProject: project => mainHttpClient.get(`/projects/${project}`),
  getProjectDataSets: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=dataset`),
  getProjectFailedJobs: (project, cancelToken) =>
    mainHttpClient.get(
      `/runs?project=${project}&state=error&start_time_from=${new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString()}`,
      {
        cancelToken: cancelToken
      }
    ),
  getProjectFeatureSets: (project, cancelToken) =>
    mainHttpClient.get(`/projects/${project}/feature-sets`, {
      cancelToken: cancelToken
    }),
  getProjectFiles: project =>
    mainHttpClient.get(`/artifacts?project=${project}&category=other`),
  getProjectFunctions: (project, cancelToken) =>
    mainHttpClient.get(`/funcs?project=${project}`, {
      cancelToken: cancelToken
    }),
  getProjectModels: (project, cancelToken) =>
    mainHttpClient.get(`/artifacts?project=${project}&category=model`, {
      cancelToken: cancelToken
    }),
  getProjectRunningJobs: (project, cancelToken) =>
    mainHttpClient.get(`/runs?project=${project}&state=running`, {
      cancelToken: cancelToken
    }),
  getProjectScheduledJobs: project =>
    mainHttpClient.get(`/projects/${project}/schedules`),
  getProjectSecrets: project =>
    mainHttpClient.get(`/projects/${project}/secret-keys?provider=kubernetes`),
  getProjects: () => mainHttpClient.get('/projects'),
  getProjectsNames: () =>
    mainHttpClient.get('/projects', {
      params: {
        format: 'name_only'
      }
    }),
  getProjectSummaries: cancelToken =>
    mainHttpClient.get('/project-summaries', {
      cancelToken
    }),
  getProjectSummary: project => {
    return mainHttpClient.get(`/project-summaries/${project}`)
  },
  getProjectWorkflows: project => {
    return mainHttpClient.get(`/projects/${project}/pipelines`)
  },
  setProjectSecret: (project, secretData) => {
    return mainHttpClient.post(`/projects/${project}/secrets`, secretData)
  },
  updateProject: (project, data) =>
    mainHttpClient.patch(`/projects/${project}`, data)
}
