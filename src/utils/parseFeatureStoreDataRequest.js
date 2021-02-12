export const parseFeatureStoreDataRequest = featureSets =>
  featureSets.map(featureSet => ({
    ...featureSet.metadata,
    ...featureSet.status,
    ...featureSet.spec
  }))
