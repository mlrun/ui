import { generateUsageSnippets } from './generateUsageSnippets'
import { FEATURE_VECTORS_TAB } from '../constants'
import { generateUri } from './resources'

export const parseFeatureVectors = featureVectors =>
  featureVectors.map(featureVector => {
    const item = {
      ...featureVector.metadata,
      ...featureVector.status,
      ...featureVector.spec
    }

    return {
      ...item,
      specFeatures: featureVector.spec.features,
      features: featureVector.status.features,
      usage_example: generateUsageSnippets(FEATURE_VECTORS_TAB, item),
      URI: generateUri(item, FEATURE_VECTORS_TAB),
      ui: {
        originalContent: featureVector
      }
    }
  })
