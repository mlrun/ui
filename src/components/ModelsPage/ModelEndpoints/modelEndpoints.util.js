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
import { isEmpty } from 'lodash'

import { LABELS_FILTER, MODEL_ENDPOINTS_TAB, MODELS_PAGE } from '../../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { showErrorNotification } from '../../../utils/notifications.util'
import { fetchModelEndpoint } from '../../../reducers/artifactsReducer'

import { ReactComponent as Alert } from 'igz-controls/images/alerts.svg'

export const filtersConfig = {
  [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
}

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
  },
  {
    label: 'metrics',
    id: 'metrics'
  },
  {
    label: 'alerts',
    id: 'alerts',
    icon: <Alert />
  }
]

export const generatePageData = (
  selectedItem,
  model_monitoring_dashboard_url,
  handleMonitoring
) => ({
  page: MODELS_PAGE,
  hidePageActionMenu: true,
  details: {
    menu: detailsMenu,
    infoHeaders,
    type: MODEL_ENDPOINTS_TAB,
    actionButton: {
      label: 'Resource monitoring',
      tooltip: !model_monitoring_dashboard_url ? 'Grafana service unavailable' : '',
      variant: TERTIARY_BUTTON,
      disabled: !model_monitoring_dashboard_url,
      onClick: () => handleMonitoring(selectedItem)
    }
  }
})

export const monitorModelEndpoint = (model_monitoring_dashboard_url, item, projectName) => {
  let redirectUrl = model_monitoring_dashboard_url
    .replace('{project}', projectName)
    .replace('{model_endpoint}', item.metadata?.uid)

  window.open(redirectUrl, '_blank')
}

export const chooseOrFetchModelEndpoint = (dispatch, selectedModelEndpoint, modelEndpointMin) => {
  if (!isEmpty(selectedModelEndpoint)) return Promise.resolve(selectedModelEndpoint)

  return dispatch(
    fetchModelEndpoint({
      project: modelEndpointMin.metadata.project,
      uid: modelEndpointMin.metadata.uid
    })
  )
    .unwrap()
    .catch(error => {
      showErrorNotification(dispatch, error, '', 'Failed to retrieve model endpoint data')
    })
}
