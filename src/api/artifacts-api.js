import httpClient from '../httpClient'

export default {
  getArtifacts: () => httpClient.get('/artifacts'),
  getArtifactPreview: (schema, path) =>
    httpClient.get(
      schema ? `/files?schema=${schema}&path=${path}` : `/files?path=${path}`
    )
}
