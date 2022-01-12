export const parseFeatureVectors = featureVectors => {
  return featureVectors.map(featureVector => ({
    ...featureVector.metadata,
    ...featureVector.status,
    ...featureVector.spec,
    specFeatures: featureVector.spec.features,
    features: featureVector.status.features,
    ui: {
      originalContent: featureVector
    }
  }))
}
