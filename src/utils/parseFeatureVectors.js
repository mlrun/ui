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
import { generateUsageSnippets } from './generateUsageSnippets'
import { FEATURE_VECTORS_TAB } from '../constants'
import { generateUri } from './resources'
import { getFeatureVectorIdentifier } from './getUniqueIdentifier'

export const parseFeatureVectors = featureVectors =>
  featureVectors?.map(featureVector => {
    const item = {
      kind: featureVector.kind,
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
        originalContent: featureVector,
        identifier: getFeatureVectorIdentifier(item),
        identifierUnique: getFeatureVectorIdentifier(item, true)
      }
    }
  })
