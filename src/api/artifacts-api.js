import httpClient from '../httpClient'

export default {
  getArtifacts: () => httpClient.get('/artifacts')
}
