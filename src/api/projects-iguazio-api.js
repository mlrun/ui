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

const projectsIguazioApi = {
  editProject: (projectId, data) => iguazioHttpClient.put(`/projects/${projectId}`, data),
  getProjectJob: jobId => iguazioHttpClient.get(`/jobs/${jobId}`),
  getProjects: config => {
    return iguazioHttpClient.get('/projects', config)
  },
  getProjectMembers: projectId => {
    return iguazioHttpClient.get(`/projects/${projectId}`, {
      params: {
        include:
          'project_authorization_roles.principal_users,project_authorization_roles.principal_user_groups'
      }
    })
  },
  getProjectMembersVisibility: project => {
    return iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: {
        action: 'authorization/roles',
        sub_resource: 'authorization/roles'
      }
    })
  },
  getProjectOwnerVisibility: project => {
    return iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: {
        action: 'update',
        sub_resource: 'authorization/owner'
      }
    })
  },
  getProjectWorkflowsUpdateAuthorization: project => {
    return iguazioHttpClient.get(`/projects/__name__/${project}/authorization`, {
      params: {
        action: 'update',
        sub_resource: 'authorization/workflow'
      }
    })
  },

  updateProjectMembers: data => {
    return iguazioHttpClient.post('/async_transactions', data)
  },
  getScrubbedUsers: config => iguazioHttpClient.get('/scrubbed_users', config),
  getScrubbedUserGroups: config => iguazioHttpClient.get('/scrubbed_user_groups', config),
  getActiveUser: () => iguazioHttpClient.get('/self')
}

export default projectsIguazioApi
