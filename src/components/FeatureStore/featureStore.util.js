import {
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURES_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB
} from '../../constants'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'

// export const featureVectorsInfoHeaders = [
//   { label: 'Description', id: 'description' },
//   { label: 'Labels', id: 'labels' },
//   { label: 'Version', id: 'tag' },
//   { label: 'URI', id: 'target_uri' },
//   { label: 'Last updated', id: 'updated' },
//   { label: 'Entities', id: 'entities' },
//   { label: 'Label column', id: 'label_column' },
//   { label: 'Usage example', id: 'usage_example' }
// ]
export const createFeatureSetTitle = 'Create set'
export const createFeatureVectorTitle = 'Create vector'

export const tabs = [
  { id: FEATURE_SETS_TAB, label: 'Feature sets' },
  { id: FEATURES_TAB, label: 'Features' },
  { id: FEATURE_VECTORS_TAB, label: 'Feature vectors' }
]

export const handleApplyDetailsChanges = (
  changes,
  fetchData,
  projectName,
  itemName,
  pageTab,
  selectedItem,
  setNotification,
  updateFeatureStoreData,
  filters
) => {
  const data = {
    metadata: {},
    spec: {}
  }
  const metadataFields = ['labels']

  Object.keys(changes.data).forEach(key => {
    if (metadataFields.includes(key)) {
      data.metadata[key] = changes.data[key].previousFieldValue
    } else {
      data.spec[key] = changes.data[key].previousFieldValue
    }
  })

  if (data.metadata.labels) {
    const objectLabels = {}

    data.metadata.labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    data.metadata.labels = { ...objectLabels }
  }

  return updateFeatureStoreData(projectName, itemName, selectedItem.tag, data, pageTab)
    .then(response => {
      return fetchData(filters).then(() => {
        setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Updated successfully'
        })

        return response
      })
    })
    .catch(error => {
      setNotification({
        status: error.response?.status || 400,
        id: Math.random(),
        message:
          error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'Permission denied.'
            : 'Failed to update.',
        retry: handleApplyDetailsChanges
      })
    })
}

export const checkTabIsValid = (navigate, params, selectedItem, pageTab) => {
  if (
    (params.tab === DETAILS_METADATA_TAB && !selectedItem.schema && !selectedItem.entities) ||
    (params.tab === DETAILS_ANALYSIS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(pageTab) &&
      !selectedItem.extra_data) ||
    (params.tab === DETAILS_STATISTICS_TAB &&
      ![FEATURE_VECTORS_TAB, FEATURE_SETS_TAB].includes(pageTab) &&
      !selectedItem.stats)
  ) {
    return navigate(
      `/projects/${params.projectName}/feature-store/${pageTab}/${params.name}${
        params.tag ? `/${params.tag}` : ''
      }/${DETAILS_OVERVIEW_TAB}`
    )
  }
}
