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
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE
} from '../../constants'
import { formatDatetime } from '../../utils'
import { isNil } from 'lodash'

export const generateArtifactsInfoContent = (page, pageTab, selectedItem) => {
  if (pageTab === MODEL_ENDPOINTS_TAB) {
    const { name, tag } =
      (selectedItem?.metadata?.uid ?? '').match(/^(?<name>.*?):(?<tag>.*)$/)
        ?.groups ?? {}
    return [tag, name]
  } else
    return [
      selectedItem.hash ?? '',
      selectedItem.db_key,
      selectedItem.iter || '0',
      page !== FEATURE_STORE_PAGE && page !== FILES_PAGE
        ? selectedItem.kind || ' '
        : null,
      selectedItem.size ?? '',
      selectedItem.target_path,
      selectedItem.tree,
      formatDatetime(new Date(selectedItem.updated), 'N/A'),
      page === MODELS_PAGE ? selectedItem.framework ?? '' : null,
      selectedItem.labels ?? [],
      selectedItem.sources
    ].filter(content => !isNil(content))
}
