import httpClient from '../httpClient'

export default {
  getAll: () => httpClient.get('/runs'),
  getJobLogs: id => httpClient.get(`/log/default/${id}`),
  getJobArtifacts: (schema, path) => {
    if (!schema) {
      return httpClient.get(`/files?path=${path}`)
    }
    return httpClient.get(`/files?schema=${schema}&path=${path}`)
  }
}
