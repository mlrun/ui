import httpClient from '../httpClient'

export default {
  getAll: () => httpClient.get('/runs'),
  getJobLogs: (id, project) => httpClient.get(`/log/${project}/${id}`),
  getJobArtifacts: (schema, path, config) => {
    return schema
      ? httpClient.get(`/files?schema=${schema}&path=${path}`, config)
      : httpClient.get(`/files?path=${path}`, config)
  }
}
