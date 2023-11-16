/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'
import { generateUri } from './resources'

export const generateUsageSnippets = (pageTab, selectedItem) => {
  if (pageTab === FEATURE_SETS_TAB) {
    return [
      {
        title: 'Get offline features for training:',
        code: `import mlrun.feature_store as fs
features = [
    "${selectedItem.project}/${selectedItem.name}.*",
]

vector = fs.FeatureVector("<vector-name>",features=features,description="this is my vector")
resp = fs.get_offline_features(vector)
#Preview the dataset
resp.to_dataframe().tail(5)`
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
        code: `import mlrun.feature_store as fs
resp = fs.get_offline_features("${uri}")
#Preview the dataset
resp.to_dataframe().tail(5)

svc = fs.get_online_feature_service("${uri}")
resp = svc.get([{"customer_id": "42"}, {"customer_id": "50"}])`
      }
    ]
  }
}
