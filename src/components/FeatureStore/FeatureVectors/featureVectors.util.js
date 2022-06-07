import React from 'react'

import {
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER
} from '../../../constants'
import featureStoreActions from '../../../actions/featureStore'
import filtersActions from '../../../actions/filters'
import notificationActions from '../../../actions/notification'

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

export const featureVectorsFilters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' }
]

export const generatePageData = selectedFeatureSet => {
  return {
    page: FEATURE_STORE_PAGE,
    details: {
      type: FEATURE_SETS_TAB,
      menu: generateFeatureVectorsDetailsMenu(selectedFeatureSet),
      infoHeaders: featureSetsInfoHeaders
    }
  }
}

export const generateActionsMenu = (onDeleteFeatureVector, toggleConvertedYaml) => [
  {
    label: 'Delete',
    icon: <Delete />,
    onClick: onDeleteFeatureVector
  },
  {
    label: 'View YAML',
    icon: <Yaml />,
    onClick: toggleConvertedYaml
  }
]

export const featuresActionCreator = {
  deleteFeatureVector: featureStoreActions.deleteFeatureVector,
  fetchFeatureVector: featureStoreActions.fetchFeatureVector,
  fetchFeatureVectors: featureStoreActions.fetchFeatureVectors,
  fetchFeatureVectorsTags: featureStoreActions.fetchFeatureVectorsTags,
  getFilterTagOptions: filtersActions.getFilterTagOptions,
  removeFeatureVector: featureStoreActions.deleteFeatureVector,
  removeFeatureVectors: featureStoreActions.removeFeatureVectors,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification,
  updateFeatureStoreData: featureStoreActions.updateFeatureStoreData
}
