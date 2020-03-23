import httpClient from '../httpClient'

export default {
  getArtifacts: item => {
    let labels = item?.labels
      ?.split(',')
      .map(item => `label=${item}`)
      .join('&')
    const url = item.labels
      ? `/artifacts?project=${item.project}&${labels}`
      : `/artifacts?project=${item.project}&tag=${item.tag}`
    return httpClient.get(url)
  },
  getArtifactPreview: (schema, path) =>
    httpClient.get(
      schema ? `/files?schema=${schema}&path=${path}` : `/files?path=${path}`
    ),
  getArtifactTag: project =>
    httpClient.get(`/projects/${project}/artifact-tags`)
}
