import { mainHttpClient } from '../httpClient'

export default {
  getAllWorkflows: () => {
    return mainHttpClient.get('/workflows?page_size=100')
  }
}
