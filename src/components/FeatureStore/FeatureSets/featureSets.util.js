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
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER
} from '../../../constants'
import featureStoreActions from '../../../actions/featureStore'
import filtersActions from '../../../actions/filters'

export const generateFeatureSetsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'features',
    id: 'features',
    hidden: !selectedItem?.entities && !selectedItem?.features
  },
  {
    label: 'transformations',
    id: 'transformations'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedItem?.stats,
    tip: 'Statistics reflect the data for the latest ingestion. \n Note that some values may be empty due to the use of different engines for calculating statistics'
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

export const featureSetsFilters = [
  { type: TAG_FILTER, label: 'Version Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' }
]

export const generatePageData = selectedFeatureSet => {
  return {
    page: FEATURE_STORE_PAGE,
    details: {
      type: FEATURE_SETS_TAB,
      menu: generateFeatureSetsDetailsMenu(selectedFeatureSet),
      infoHeaders: featureSetsInfoHeaders
    }
  }
}

export const featureSetsActionCreator = {
  fetchFeatureSet: featureStoreActions.fetchFeatureSet,
  fetchFeatureSets: featureStoreActions.fetchFeatureSets,
  fetchFeatureSetsTags: featureStoreActions.fetchFeatureSetsTags,
  getFilterTagOptions: filtersActions.getFilterTagOptions,
  removeFeatureSet: featureStoreActions.removeFeatureSet,
  removeFeatureSets: featureStoreActions.removeFeatureSets,
  removeFeatureStoreError: featureStoreActions.removeFeatureStoreError,
  removeNewFeatureSet: featureStoreActions.removeNewFeatureSet,
  setFilters: filtersActions.setFilters,
  updateFeatureStoreData: featureStoreActions.updateFeatureStoreData
}
