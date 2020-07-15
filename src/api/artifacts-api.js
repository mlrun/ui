import { mainHttpClient } from '../httpClient'

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

    return mainHttpClient.get(url)
  },
  getArtifactPreview: (schema, path, user) =>
    mainHttpClient.get('/files', {
      params: schema ? { schema, path, user } : { path, user }
    }),
  getArtifactTag: project =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`),
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data)
}
