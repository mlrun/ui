import { mainHttpClient } from '../httpClient'
import { FEATURE_SETS_TAB, FEATURES_TAB } from '../constants'

const fetchArtifacts = (item, path) => {
  let url = path

  if (item?.labels) {
    let labels = item?.labels
      ?.split(',')
      .map(item => `label=${item}`)
      .join('&')

    url = `${url}&${labels}`
  }

  if (item?.tag && !/latest/i.test(item.tag)) {
    url = `${url}&tag=${item.tag}`
  }

  if (item?.name) {
    url = `${url}&name=${item.name}`
  }

  return mainHttpClient.get(url)
}

const fetchFeatureStoreData = (item, tab) => {
  const initialUrl = `/projects/${item.project}/${tab}`
  let url = initialUrl

  if (item?.labels) {
    let labels = item?.labels
      ?.split(',')
      .map(item => `label=${item}`)
      .join('&')

    url = `${url}?${labels}`
  }

  if (item?.name) {
    url = `${url === initialUrl ? `${url}?` : `${url}&`}name=${item.name}`
  }

  return mainHttpClient.get(url)
}

export default {
  getArtifactPreview: (schema, path, user) =>
    mainHttpClient.get('/files', {
      params: schema ? { schema, path, user } : { path, user }
    }),
  getArtifactTag: project =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`),
  getArtifacts: item => {
    return fetchArtifacts(item, `/artifacts?project=${item.project}`)
  },
  getArtifactsDataSets: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=dataset`
    )
  },
  getArtifactsFiles: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=other`
    )
  },
  getArtifactsModels: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=model`
    )
  },
  getFeatureSets: item => {
    return fetchFeatureStoreData(item, FEATURE_SETS_TAB)
  },
  getFeatures: item => {
    return fetchFeatureStoreData(item, FEATURES_TAB)
  },
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data)
}
