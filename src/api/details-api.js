import { mainHttpClient } from '../httpClient'

const detailsApi = {
  getJobPods: project =>
    mainHttpClient.get(`/projects/${project}/runtime-resources?group-by=job`),
  getModelEndpoint: (project, uid) =>
    mainHttpClient.get(
      `/projects/${project}/model-endpoints/${uid}?feature_analysis=true`
    ),
  getModelFeatureVector: (project, name, reference) =>
    mainHttpClient.get(
      `/projects/${project}/feature-vectors/${name}/references/${reference}`
    )
}

export default detailsApi
