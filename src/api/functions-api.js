import httpClient from '../httpClient'

export default {
  getAll: project => httpClient.get(`/funcs?project=${project}`),
  filterByStatus: (project, state) =>
    httpClient.get(`/funcs?project=${project}&&state=${state.toLowerCase()}`)
}
