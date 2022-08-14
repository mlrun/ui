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
    tip:
      'Statistics reflect the data for the latest ingestion. \n Note that some values may be empty due to the use of different engines for calculating statistics'
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
  setNotification: notificationActions.setNotification,
  updateFeatureStoreData: featureStoreActions.updateFeatureStoreData
}
