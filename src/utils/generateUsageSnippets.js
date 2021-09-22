import { FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'
import { generateUri } from './resources'

export const generateUsageSnippets = (pageTab, selectedItem) => {
  if (pageTab === FEATURE_SETS_TAB) {
    return [
      {
        title: 'Get offline features for training:',
        code: `features = [
    "${selectedItem.name}.*",
]

vector = fs.FeatureVector("<vector-name>",features=features,description="this is my vector")
resp = fs.get_offline_features(vector)`
      },
      {
        title: 'Getting online features:',
        code: `svc = fs.get_online_feature_service("<vector-uri>")
resp = svc.get([{"${selectedItem.entities[0]?.name ?? ''}": <value>}])`
      }
    ]
  }

  if (pageTab === FEATURE_VECTORS_TAB) {
    const uri = generateUri(selectedItem, pageTab)

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
