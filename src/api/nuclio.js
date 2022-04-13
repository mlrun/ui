import { nuclioHttpClient } from '../httpClient'

export default {
  getApiGateways: project => {
    return nuclioHttpClient.get('/api_gateways', {
      headers: {
        'x-nuclio-project-name': project
      }
    })
  },
  getV3ioStreamShardLags: (project, body) =>
    nuclioHttpClient.post('/v3io_streams/get_shard_lags', body, {
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
