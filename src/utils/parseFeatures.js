export const parseFeatures = features => {
  return features.map(feature => {
    const type = feature.feature ? 'feature' : 'entity'

    return {
      ...feature[type],
      ...feature.feature_set_digest,
      ui: {
        type: type,
        originalContent: feature
      }
    }
  })
}
