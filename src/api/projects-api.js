/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { mainHttpClient } from '../httpClient'

const projectsApi = {
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
    mainHttpClient.delete(`/projects/${project}/secrets?provider=kubernetes&secret=${key}`),
  editProject: (project, data) => mainHttpClient.put(`/projects/${project}`, data),
  getJobsAndWorkflows: (project, params) => mainHttpClient.get('/runs', { params }),
  getProject: project => mainHttpClient.get(`/projects/${project}`),
  getProjectDataSets: project =>
    mainHttpClient.get(`/projects/${project}/artifacts?category=dataset`),
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
  getProjectFiles: project => mainHttpClient.get(`/projects/${project}/artifacts?category=other`),
  getProjectFunctions: (project, cancelToken) =>
    mainHttpClient.get(`/funcs?project=${project}`, {
      cancelToken: cancelToken
    }),
  getProjectModels: (project, cancelToken) =>
    mainHttpClient.get(`/projects/${project}/artifacts?category=model`, {
      cancelToken: cancelToken
    }),
  getProjectRunningJobs: (project, cancelToken) =>
    mainHttpClient.get(`/runs?project=${project}&state=running`, {
      cancelToken: cancelToken
    }),
  getProjectScheduledJobs: project => mainHttpClient.get(`/projects/${project}/schedules`),
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
  updateProject: (project, data) => mainHttpClient.patch(`/projects/${project}`, data)
}

export default projectsApi
