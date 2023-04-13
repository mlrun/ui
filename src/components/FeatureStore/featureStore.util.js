/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import {
  DETAILS_ANALYSIS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURES_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  TAG_LATEST
} from '../../constants'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { truncateUid } from '../../utils'
import { convertChipsData } from '../../utils/convertChipsData'

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
  filters,
  dispatch
) => {
  const data = {
    ...selectedItem.ui.originalContent
  }
  const metadataFields = ['labels']

  Object.keys(changes.data).forEach(key => {
    if (metadataFields.includes(key)) {
      data.metadata[key] = changes.data[key].currentFieldValue
    } else if ( key === 'features') {
      data.spec[key] = changes.data.features.currentFieldValue.map((item) => {
        const { featureSet, feature, alias} = item
        return `${featureSet}.${feature}${alias === '' ? '' : ` as ${alias}`}`
      })
    } else {
      data.spec[key] = changes.data[key].currentFieldValue
    }
  })

  if (data.metadata.labels && changes.data.labels) {
    data.metadata.labels = convertChipsData(data.metadata.labels)
  }

  return updateFeatureStoreData(
    projectName,
    itemName,
    selectedItem.tag || TAG_LATEST,
    data,
    pageTab
  )
    .then(response => {
      return fetchData(filters).then(() => {
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Updated successfully'
          })
        )

        return response
      })
    })
    .then(response => {
      if (!selectedItem.tag) {
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: `${truncateUid(selectedItem.uid)} updated to latest`
          })
        )
      }

      return response
    })
    .catch(error => {
      dispatch(
        setNotification({
          status: error.response?.status || 400,
          id: Math.random(),
          message:
            error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'Permission denied.'
              : 'Failed to update.',
          retry: handleApplyDetailsChanges
        })
      )
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
