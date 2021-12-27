import getState from './getState'

export const parseFeatureSets = featureSets =>
  featureSets.map(featureSet => ({
    ...featureSet.status,
    ...featureSet.spec,
    ...featureSet.metadata,
    state: getState(featureSet.status.state),
    ui: {
      originalContent: featureSet
    }
  }))
