import httpClient from '../httpClient'

export default {
  getAll: () => httpClient.get('/runs'),
  getJobLogs: id => httpClient.get(`/log/default/${id}`)
}
