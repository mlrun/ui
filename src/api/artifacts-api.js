import httpClient from '../httpClient'

export default {
  getArtifacts: item => {
    let url = `/artifacts?project=${item.project}`
    if (item?.labels) {
      let labels = item?.labels
        ?.split(',')
        .map(item => `label=${item}`)
        .join('&')

      url = `${url}&${labels}`
    }
    if (item?.tag) {
      url = `${url}&tag=${item.tag}`
    }
    if (item?.name) {
      url = `${url}&name=${item.name}`
    }
    return httpClient.get(url)
  },
  getArtifactPreview: (schema, path, user) =>
    httpClient.get(
      schema
        ? `/files?schema=${schema}&path=${path}&user=${user}`
        : `/files?path=${path}&user=${user}`
    ),
  getArtifactTag: project =>
    httpClient.get(`/projects/${project}/artifact-tags`)
}
