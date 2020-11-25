export const generateFeatureSets = featureSets =>
  featureSets.map(featureSet => ({
    ...featureSet.metadata,
    ...featureSet.status,
    ...featureSet.spec
  }))
