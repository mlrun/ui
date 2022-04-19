import getState from './getState'
import { generateUsageSnippets } from './generateUsageSnippets'
import { FEATURE_SETS_TAB } from '../constants'
import { generateUri } from './resources'

export const parseFeatureSets = featureSets =>
  featureSets.map(featureSet => {
    const item = {
      ...featureSet.status,
      ...featureSet.spec,
      ...featureSet.metadata
    }

    return {
      ...item,
      state: getState(featureSet.status.state),
      usage_example: generateUsageSnippets(FEATURE_SETS_TAB, item),
      URI: generateUri(item, FEATURE_SETS_TAB),
      ui: {
        originalContent: featureSet
      }
    }
  })
