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
import {
  ARTIFACTS_TAB,
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  MODELS_TAB
} from '../constants'
import { isNil } from 'lodash'

export const generateUri = (item, tab) => {
  let uri = `store://${tab}/${item.project}/`

  if (tab === MODELS_TAB || tab === DATASETS_TAB || tab === ARTIFACTS_TAB) {
    uri += item.db_key
    uri += getArtifactReference(item)
  } else if (tab === FEATURE_SETS_TAB || tab === FEATURE_VECTORS_TAB) {
    uri += item.name
    uri += getFeatureReference(item)
  }

  return uri
}

export const getArtifactReference = item => {
  let reference = `#${item.iter || 0}`

  if (!isNil(item.tag)) {
    reference += `:${item.tag}`
  } else if (!isNil(item.tree)) {
    reference += `@${item.tree}`
  } else {
    reference += ':latest'
  }

  return reference
}

export const getFeatureReference = item => {
  let reference = ''

  if (item.tag) reference += `:${item.tag}`
  else if (item.uid) reference += `@${item.uid}`

  return reference
}

export const getParsedResource = resource => {
  let parsedResource = ['', '']

  if (resource) {
    const match = resource.match(/([^:#@]+)([:#@]?.+)?/)
    if (match) parsedResource = [match[1] ?? '', match[2] ?? '']
  }

  return parsedResource
}
