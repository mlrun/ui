import getState from './getState'

export const parseFeatureSets = featureSets =>
  featureSets.map(featureSet => ({
    ...featureSet.metadata,
    ...featureSet.status,
    ...featureSet.spec,
    state: getState(featureSet.status.state),
    ui: {
      originalContent: featureSet
    }
  }))
