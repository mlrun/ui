import { mainHTTPClient } from '../httpClient'

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

    return mainHTTPClient.get(url)
  },
  getArtifactPreview: (schema, path, user) => {
    let url = '/files?'

    if (schema) {
      url = `${url}schema=${schema}`
    }

    if (path) {
      url = `${url}&path=${path}`
    }

    if (user) {
      url = `${url}&user=${user}`
    }

    return mainHTTPClient.get(url)
  },
  getArtifactTag: project =>
    mainHTTPClient.get(`/projects/${project}/artifact-tags`)
}
