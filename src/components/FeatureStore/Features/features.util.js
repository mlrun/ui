import { LABELS_FILTER, NAME_FILTER, TAG_FILTER } from '../../../constants'
import featureStoreActions from '../../../actions/featureStore'
import filtersActions from '../../../actions/filters'

export const featuresFilters = [
  { type: TAG_FILTER, label: 'Tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' }
]

export const featuresActionCreator = {
  fetchEntity: featureStoreActions.fetchEntity,
  fetchFeature: featureStoreActions.fetchFeature,
  fetchEntities: featureStoreActions.fetchEntities,
  fetchFeatures: featureStoreActions.fetchFeatures,
  fetchFeatureSetsTags: featureStoreActions.fetchFeatureSetsTags,
  fetchFeatureVectors: featureStoreActions.fetchFeatureVectors,
  getFilterTagOptions: filtersActions.getFilterTagOptions,
  removeEntity: featureStoreActions.removeEntity,
  removeFeature: featureStoreActions.removeFeature,
  setFilters: filtersActions.setFilters,
  removeFeatures: featureStoreActions.removeFeatures,
  removeEntities: featureStoreActions.removeEntities
}
