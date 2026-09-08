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
import { iguazioHttpClient } from '../httpClient'
import { IS_MF_MODE } from '../constants'

const igz3Api = {
  editProject: (projectId, data) => iguazioHttpClient.put(`/projects/${projectId}`, data),
  getProjectJob: jobId => iguazioHttpClient.get(`/jobs/${jobId}`),
  getProjects: config => iguazioHttpClient.get('/projects', config),
  getProjectMembers: projectId =>
    iguazioHttpClient.get(`/projects/${projectId}`, {
      params: {
        include:
          'project_authorization_roles.principal_users,project_authorization_roles.principal_user_groups'
      }
    }),
  getProjectMembersVisibility: project =>
    iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: { action: 'authorization/roles', sub_resource: 'authorization/roles' }
    }),
  getProjectOwnerVisibility: project =>
    iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: { action: 'update', sub_resource: 'authorization/owner' }
    }),
  getProjectWorkflowsUpdateAuthorization: project =>
    iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: { action: 'update', sub_resource: 'workflow' }
    }),
  updateProjectMembers: data => iguazioHttpClient.post('/async_transactions', data),
  getScrubbedUsers: config => iguazioHttpClient.get('/scrubbed_users', config),
  getScrubbedUserGroups: config => iguazioHttpClient.get('/scrubbed_user_groups', config),
  getActiveUser: () => iguazioHttpClient.get('/self')
}

const igz4Api = {
  updateProjectOwner: (projectName, owner) =>
    iguazioHttpClient.put(`/v1/authorization/projects/${projectName}/owner`, {
      owner,
      project: projectName
    }),
  getProjectPolicies: projectName =>
    iguazioHttpClient.get(`/v1/authorization/projects/${projectName}/policies`),
  setProjectMembership: (projectName, data) =>
    iguazioHttpClient.put(`/v1/authorization/projects/${projectName}/roles`, data),
  searchUsersMetadata: searchTerm =>
    iguazioHttpClient.get('/v1/profile/search-users-metadata', { params: { searchTerm } }),
  searchGroupsMetadata: searchTerm =>
    iguazioHttpClient.get('/v1/profile/search-groups-metadata', { params: { searchTerm } }),
  getActiveUser: () =>
    iguazioHttpClient.get('/v1/authentication/self', { params: { format: 'full' } })
}

export default IS_MF_MODE ? igz4Api : igz3Api
