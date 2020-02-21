import httpClient from '../httpClient'

export default {
  getAll: project => httpClient.get(`/runs?project=${project}`),
  getJobLogs: (id, project) => httpClient.get(`/log/${project}/${id}`)
}
