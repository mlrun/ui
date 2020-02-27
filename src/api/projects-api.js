import httpClient from '../httpClient'

export default {
  getProjects: () => {
    return httpClient.get('/projects')
  }
}
