import httpClient from '../httpClient'

export default {
  getAll: project => httpClient.get(`/runs?project=${project}`),
  getJobLogs: (id, project) => httpClient.get(`/log/${project}/${id}`),
  filterByStatus: (project, state) =>
    httpClient.get(`/runs?project=${project}&&state=${state.toLowerCase()}`)
}
