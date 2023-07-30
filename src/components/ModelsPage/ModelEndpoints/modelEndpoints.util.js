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
import { LABELS_FILTER, MODEL_ENDPOINTS_TAB, MODELS_PAGE, SORT_BY } from '../../../constants'
import { filterSelectOptions } from '../../FilterMenu/filterMenu.settings'
import DetailsInfoItem from '../../../elements/DetailsInfoItem/DetailsInfoItem'
import { roundFloats } from '../../../utils/roundFloats'

export const filters = [
  { type: LABELS_FILTER, label: 'Labels:' },
  {
    type: SORT_BY,
    label: 'Sort By:',
    options: [{ label: 'Function', id: 'function' }, ...filterSelectOptions.sortBy]
  }
]

const infoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Model class', id: 'model_class' },
  { label: 'Model artifact', id: 'model_artifact' },
  { label: 'Function URI', id: 'function_uri' },
  { label: 'Function Tag', id: 'function_tag' },
  { label: 'Feature set', id: 'monitoring_feature_set_uri' },
  { label: 'Last prediction', id: 'last_prediction' },
  { label: 'Error count', id: 'error_count' },
  { label: 'Accuracy', id: 'accuracy' },
  { label: 'Stream path', id: 'stream_path' }
]

const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'features analysis',
    id: 'features-analysis',
    tip: 'The statistics are calculated on the last rolling hour of data'
  }
]

const modelEndpointsDriftHeaders = [
  { label: 'Mean TVD', id: 'tvd_mean' },
  { label: 'Mean Hellinger', id: 'hellinger_mean' },
  { label: 'Mean KLD', id: 'kld_mean' }
]

export const generateDriftDetailsInfo = modelEndpoint => {
  return modelEndpointsDriftHeaders?.map(header => {
    return (
      <li className="details-item" key={header.id}>
        <div className="details-item__header">{header.label}</div>
        <DetailsInfoItem
          info={roundFloats(modelEndpoint.status?.drift_measures?.[header.id], 2) ?? '-'}
        />
      </li>
    )
  })
}

export const generatePageData = modelEndpointData => ({
  page: MODELS_PAGE,
  hidePageActionMenu: true,
  details: {
    menu: detailsMenu,
    infoHeaders,
    type: MODEL_ENDPOINTS_TAB,
    additionalInfo: {
      header: 'Drift',
      body: generateDriftDetailsInfo(modelEndpointData),
      hidden: !modelEndpointData?.status?.drift_measures
    }
  }
})
