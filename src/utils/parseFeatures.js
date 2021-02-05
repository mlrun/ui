export const parseFeatures = features => {
  return features.map(feature => ({
    ...feature.feature,
    ...feature.feature_set_digest
  }))
}
