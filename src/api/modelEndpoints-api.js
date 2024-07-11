/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { mainHttpClient } from '../httpClient'

const modelEndpointsApi = {
  getModelEndpoint: (project, uid) =>
    mainHttpClient.get(`/projects/${project}/model-endpoints/${uid}?feature_analysis=true`),
  getModelEndpoints: (project, filters, config = {}, params = {}) => {
    const newConfig = {
      ...config,
      params
    }

    if (filters?.labels) {
      newConfig.params.label = filters.labels?.split(',')
    }

    return mainHttpClient.get(`/projects/${project}/model-endpoints`, newConfig)
  },
  getModelEndpointMetrics: (project, uid, type = 'all') =>
    mainHttpClient.get(`/projects/${project}/model-endpoints/${uid}/metrics?type=${type}`), // type=results/metrics/all
  getModelEndpointMetricsValues: (project, uid, params, signal) => {
    const config = {
      params
    }

    if (signal) {
      config.signal = signal
    }

    return mainHttpClient.get(`/projects/${project}/model-endpoints/${uid}/metrics-values`, config)
  }
}

export default modelEndpointsApi
