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
import { nuclioHttpClient } from '../httpClient'

const nuclioApi = {
  getApiGateways: (project, signal) => {
    return nuclioHttpClient.get('/api_gateways', {
      headers: {
        'x-nuclio-project-name': project
      },
      signal
    })
  },
  getV3ioStreamShardLags: (project, body) =>
    nuclioHttpClient.post('/v3io_streams/get_shard_lags', body, {
      headers: { 'x-nuclio-project-name': project }
    }),
  getV3ioStreams: (project, signal) =>
    nuclioHttpClient.get('/v3io_streams', {
      headers: { 'x-nuclio-project-name': project },
      signal
    }),
  getFunctions: (project, signal) => {
    let config = project
      ? {
          headers: {
            'x-nuclio-project-name': project
          },
          signal
        }
      : { signal }

    return nuclioHttpClient.get('/functions', config)
  }
}

export default nuclioApi
