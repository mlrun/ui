import { nuclioHttpClient } from '../httpClient'

const nuclioApi = {
  getApiGateways: project => {
    return nuclioHttpClient.get('/api_gateways', {
      headers: {
        'x-nuclio-project-name': project
      }
    })
  },
  getV3ioStreamShardLags: project =>
    nuclioHttpClient.get('/v3io_streams/get_shard_lags', {
      headers: { 'x-nuclio-project-name': project }
    }),
  getV3ioStreams: project =>
    nuclioHttpClient.get('/v3io_streams', {
      headers: { 'x-nuclio-project-name': project }
    }),
  getFunctions: project => {
    let config = project
      ? {
          headers: {
            'x-nuclio-project-name': project
          }
        }
      : {}

    return nuclioHttpClient.get('/functions', config)
  }
}

export default nuclioApi
