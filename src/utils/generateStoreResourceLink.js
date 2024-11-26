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
  DATASETS_TAB,
  FEATURE_VECTORS_TAB,
  FILES_TAB,
  MODELS_TAB,
  TAG_FILTER_LATEST
} from '../constants'

export const generateStoreResourceLink = (resource, projectName) => {
  const input = { ...resource }

  if ([MODELS_TAB, DATASETS_TAB].includes(input.kind)) {
    input.kind = input.kind.slice(0, -1)
  } else if (FEATURE_VECTORS_TAB === input.kind) {
    input.kind = 'FeatureVector'
  }

  const inputsLinks = {
    model: `${process.env.PUBLIC_URL}/projects/${projectName}/models/${MODELS_TAB}/${
      input.db_key || input.key
    }/${input.tag ?? input.tree ?? TAG_FILTER_LATEST}${input.iter ? `/${input.iter}` : ''}/overview`,
    dataset: `${process.env.PUBLIC_URL}/projects/${projectName}/${DATASETS_TAB}/${
      input.db_key || input.key
    }/${input.tag ?? input.tree ?? TAG_FILTER_LATEST}${input.iter ? `/${input.iter}` : ''}/overview`,
    files: `${process.env.PUBLIC_URL}/projects/${projectName}/${FILES_TAB}/${input.db_key || input.key}/${input.tag ?? input.tree ?? TAG_FILTER_LATEST}${
      input.iter ? `/${input.iter}` : ''
    }/overview`,
    FeatureVector: `${process.env.PUBLIC_URL}/projects/${projectName}/feature-store/${FEATURE_VECTORS_TAB}/${input.name ?? input.key}/${input.tag ?? input.uid ?? TAG_FILTER_LATEST}/overview`
  }

  return input ? (inputsLinks[input.kind] ?? inputsLinks.files) : ''
}
