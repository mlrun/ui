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
  updateProjectMembers: data => {
    return iguazioHttpClient.post('/async_transactions', data)
  },
  getScrubbedUsers: () => iguazioHttpClient.get('/scrubbed_users'),
  getScrubbedUserGroups: () => iguazioHttpClient.get('/scrubbed_user_groups')
}
