import { mainHttpClient } from '../httpClient'

export default {
  getProjects: () => {
    return mainHttpClient.get('/projects?full=yes')
  }
}
