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
  getProjects: () => mainHttpClient.get('/projects'),
  getProjectsSummary: cancelToken =>
    // mainHttpClient.get('/projects?format=summary', { cancelToken }),
    Promise.resolve({
      projects: [
        {
          name: 'default',
          functions_count: 32,
          feature_sets_count: 45,
          models_count: 29,
          runs_failed_recent_count: 3,
          runs_running_count: 93
        },
        {
          name: 'long-long-long-long-long-long-long-long-long-long',
          functions_count: 32,
          feature_sets_count: 45,
          models_count: 29,
          runs_failed_recent_count: 3,
          runs_running_count: 93
        },
        {
          name: 'test',
          functions_count: 32,
          feature_sets_count: 45,
          models_count: 29,
          runs_failed_recent_count: 3,
          runs_running_count: 93
        }
      ]
    }),
  getProjectWorkflows: project => {
    return mainHttpClient.get(`/projects/${project}/pipelines`)
  },
  updateProject: (project, data) =>
    mainHttpClient.patch(`/projects/${project}`, data)
}
