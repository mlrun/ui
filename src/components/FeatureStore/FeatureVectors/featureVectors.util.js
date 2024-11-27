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
import React from 'react'

import {
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER,
  TAG_FILTER_LATEST
} from '../../../constants'
import featureStoreActions from '../../../actions/featureStore'
import { parseFeatureTemplate } from '../../../utils/parseFeatureTemplate'
import { parseChipsData } from '../../../utils/convertChipsData'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

export const generateFeatureVectorsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'requested features',
    id: 'requested-features'
  },
  {
    label: 'returned features',
    id: 'returned-features',
    hidden: !selectedItem.features
  },
  {
    label: 'preview',
    id: 'preview',
    hidden: true // Temporary hidden because there is no implementation yet
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedItem.stats && !selectedItem.features
  },
  {
    label: 'analysis',
    id: 'analysis'
  }
]

export const featureSetsInfoHeaders = [
  { label: 'Description', id: 'description' },
  { label: 'Labels', id: 'labels' },
  { label: 'Version tag', id: 'tag' },
  { label: 'Last updated', id: 'updated' },
  { label: 'Entities', id: 'entities' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Timestamp key', id: 'timestamp_key' },
  { label: 'Relations', id: 'relations', hidden: true },
  { label: 'Label column', id: 'label_column' },
  { label: 'Usage example', id: 'usage_example' }
]

export const filtersConfig = {
  [NAME_FILTER]: { label: 'Name:', initialValue: '' },
  [TAG_FILTER]: { label: 'Version Tag:', initialValue: TAG_FILTER_LATEST, isModal: true },
  [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
}

export const generatePageData = selectedFeatureSet => {
  return {
    page: FEATURE_STORE_PAGE,
    details: {
      type: FEATURE_VECTORS_TAB,
      menu: generateFeatureVectorsDetailsMenu(selectedFeatureSet),
      infoHeaders: featureSetsInfoHeaders
    }
  }
}

export const generateActionsMenu = (
  onDeleteFeatureVector,
  toggleConvertedYaml,
  isDetailsPopUp = false
) => [
  [
    {
      label: 'View YAML',
      icon: <Yaml />,
      onClick: toggleConvertedYaml
    },
    {
      label: 'Delete',
      hidden: isDetailsPopUp,
      icon: <Delete />,
      className: 'danger',
      onClick: onDeleteFeatureVector
    }
  ]
]

export const searchFeatureVectorItem = (content, name, tag) => {
  return content.find(contentItem => {
    return contentItem.name === name && (contentItem.tag === tag || contentItem.uid === tag)
  })
}

export const featureVectorsActionCreator = {
  deleteFeatureVector: featureStoreActions.deleteFeatureVector,
  fetchFeatureVector: featureStoreActions.fetchFeatureVector,
  fetchFeatureVectors: featureStoreActions.fetchFeatureVectors,
  fetchFeatureVectorsTags: featureStoreActions.fetchFeatureVectorsTags,
  removeFeatureVector: featureStoreActions.removeFeatureVector,
  removeFeatureVectors: featureStoreActions.removeFeatureVectors,
  updateFeatureStoreData: featureStoreActions.updateFeatureStoreData
}

export const generateDetailsFormInitialValue = (selectedFeatureVector, internalLabels) => {
  return {
    features: (selectedFeatureVector.specFeatures ?? []).map(featureData => {
      return { ...parseFeatureTemplate(featureData) }
    }),
    description: selectedFeatureVector.description,
    labels: parseChipsData(selectedFeatureVector.labels, internalLabels)
  }
}
