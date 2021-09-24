import { mainHttpClient } from '../httpClient'

export default {
  getWorkflow: workflowId => {
    return mainHttpClient.get(`/pipelines/${workflowId}`)
  },
  getWorkflows: project => {
    return mainHttpClient.get(`/projects/${project}/pipelines`)
  }
}
