import httpClient from '../httpClient'

export default {
  getArtifacts: project => httpClient.get(`/artifacts?project=${project}`),
  getArtifactPreview: (schema, path) =>
    httpClient.get(
      schema ? `/files?schema=${schema}&path=${path}` : `/files?path=${path}`
    )
}
