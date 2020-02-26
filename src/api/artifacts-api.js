import httpClient from '../httpClient'

export default {
  getArtifacts: item =>
    httpClient.get(`/artifacts?project=${item.project}&tag=${item.tag}`),
  getArtifactPreview: (schema, path) =>
    httpClient.get(
      schema ? `/files?schema=${schema}&path=${path}` : `/files?path=${path}`
    ),
  getArtifactTag: project =>
    httpClient.get(`/projects/${project}/artifact-tags`)
}
