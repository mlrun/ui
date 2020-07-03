import { mainHttpClient } from '../httpClient'

export default {
  getProjects: () => mainHttpClient.get('/projects?full=yes'),
  createProject: postData => mainHttpClient.post('/project', postData)
}
