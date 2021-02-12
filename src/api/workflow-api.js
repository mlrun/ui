import { mainHttpClient } from '../httpClient'

export default {
  getWorkflows: (project, pageToken, pageSize = 100) => {
    const params = {
      page_size: pageSize
    }
    if (pageToken) {
      params.page_token = pageToken
    }
    return mainHttpClient.get(`/projects/${project}/pipelines`, { params })
  }
}
