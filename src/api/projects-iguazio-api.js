import { iguazioHttpClient } from '../httpClient'

export default {
  editProject: (projectId, data) =>
    iguazioHttpClient.put(`/projects/${projectId}`, data),
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
    return iguazioHttpClient.get(
      `/projects/__name__/${project}/authorization`,
      {
        params: {
          action: 'authorization/roles',
          sub_resource: 'authorization/roles'
        }
      }
    )
  },
  getProjectOwnerVisibility: project => {
    return iguazioHttpClient.get(
      `/projects/__name__/${project}/authorization`,
      {
        params: {
          action: 'update',
          sub_resource: 'authorization/owner'
        }
      }
    )
  },
  updateProjectMembers: data => {
    return iguazioHttpClient.post('/async_transactions', data)
  },
  getScrubbedUsers: config => iguazioHttpClient.get('/scrubbed_users', config),
  getScrubbedUserGroups: () => iguazioHttpClient.get('/scrubbed_user_groups')
}
