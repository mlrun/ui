import httpClient from '../httpClient'

export default {
  getAll: project => httpClient.get(`/funcs?project=${project}`)
}
