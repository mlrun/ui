import { FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'
import { generateUri } from './generateUri'

export const generateUsageSnippets = (
  { pageTab, name, tag },
  { featureSets, featureVectors }
) => {
  const [currentFeatureSet] = featureSets.filter(
    featureSet =>
      featureSet.metadata.name === name && featureSet.metadata.tag === tag
  )
  const [currentFeatureVector] = featureVectors.allData.filter(
    featureVector => featureVector.name === name && featureVector.tag === tag
  )

  if (pageTab === FEATURE_SETS_TAB) {
    return [
      {
        title: 'Get offline features for training:',
        code: `features = [
    "${currentFeatureSet.metadata.name}.*",
]

vector = fs.FeatureVector("<vector-name>",features=features,description="this is my vector")
resp = fs.get_offline_features(vector))`
      },
      {
        title: 'Getting online features:',
        code: `svc = fs.get_online_feature_service("<vector-uri>")
resp = svc.get([{"customer_id": "42"}, {"customer_id": "50"}])`
      }
    ]
  }

  if (pageTab === FEATURE_VECTORS_TAB) {
    const uri = generateUri(currentFeatureVector, pageTab)

    return [
      {
        title: 'Getting offline & online features:',
        code: `resp = fs.get_offline_features("${uri}")

svc = fs.get_online_feature_service("${uri}")
resp = svc.get([{"customer_id": "42"}, {"customer_id": "50"}])`
      }
    ]
  }
}
