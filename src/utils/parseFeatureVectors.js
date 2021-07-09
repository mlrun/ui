import getState from './getState'

export const parseFeatureVectors = featureVectors => {
  return featureVectors.map(featureVector => ({
    ...featureVector.metadata,
    ...featureVector.status,
    ...featureVector.spec,
    state: getState(featureVector.status.state),
    specFeatures: featureVector.spec.features,
    features: featureVector.status.features
  }))
}
