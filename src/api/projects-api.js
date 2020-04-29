import { mainHTTPClient } from '../httpClient'

export default {
  getProjects: () => {
    return mainHTTPClient.get('/projects?full=yes')
  }
}
