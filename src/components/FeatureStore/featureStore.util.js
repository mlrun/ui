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
import { cloneDeep } from 'lodash'

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
import { convertChipsData } from '../../utils/convertChipsData'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { truncateUid } from 'igz-controls/utils/string.util'
import { updateFeatureStoreData } from '../../reducers/featureStoreReducer'

export const createFeatureSetTitle = 'Create set'
export const createFeatureVectorTitle = 'Create vector'
export const addToFeatureVectorTitle = 'Add to feature vector'

export const tabs = [
  { id: FEATURE_SETS_TAB, label: 'Feature sets' },
  { id: FEATURES_TAB, label: 'Features' },
  { id: FEATURE_VECTORS_TAB, label: 'Feature vectors' }
]

const joinFeatureTemplate = featureItem => {
  const { project, featureSet, feature, alias, tag } = featureItem

  return `${project ? `${project}/` : ''}${featureSet ? `${featureSet}${tag ? `:${tag}` : ''}.` : ''}${feature}${alias === '' ? '' : ` as ${alias}`}`
}

export const handleApplyDetailsChanges = (
  changes,
  fetchData,
  projectName,
  itemName,
  pageTab,
  selectedItem,
  setNotification,
  filters,
  dispatch
) => {
  const data = {
    ...selectedItem.ui.originalContent
  }
  const changesData = cloneDeep(changes.data)
  const metadataFields = ['labels']

  if (changesData.features) {
    changesData.features.currentFieldValue = changes.data.features.currentFieldValue.map(
      feature => {
        return joinFeatureTemplate(feature)
      }
    )

    if (changesData.label_feature) {
      changesData.label_feature.currentFieldValue = joinFeatureTemplate(
        changesData.label_feature.currentFieldValue
      )
    }
  }

  Object.keys(changesData).forEach(key => {
    if (metadataFields.includes(key)) {
      data.metadata[key] = changesData[key].currentFieldValue
    } else {
      data.spec[key] = changesData[key].currentFieldValue
    }
  })

  if (data.metadata.labels && changesData.labels) {
    data.metadata.labels = convertChipsData(data.metadata.labels)
  }

  return dispatch(
    updateFeatureStoreData({
      projectName,
      featureData: itemName,
      tag: selectedItem.tag || TAG_LATEST,
      data,
      pageTab
    })
  )
    .unwrap()
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
      const customErrorMsg =
        error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
          ? 'Permission denied'
          : 'Failed to update'

      showErrorNotification(dispatch, error, '', customErrorMsg, () =>
        handleApplyDetailsChanges(
          changes,
          fetchData,
          projectName,
          itemName,
          pageTab,
          selectedItem,
          setNotification,
          filters,
          dispatch
        )
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
