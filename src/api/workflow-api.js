import { mainHTTPClient } from '../httpClient'

export default {
  getAllWorkflows: () => {
    return mainHTTPClient.get('/workflows?page_size=100')
  }
}
