import httpClient from '../httpClient'

export default {
  getAll: () => httpClient.get('/runs')
}
