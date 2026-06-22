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

export const APPLICATION_DETAILS_TAB = {
  OVERVIEW: 'overview',
  CONFIGURATION: 'configuration',
  MONITORING_ENDPOINTS: 'monitoring-endpoints',
  BUILD_LOGS: 'build-logs',
  API_GATEWAYS: 'api-gateways'
}

export const APPLICATION_DETAILS_TABS = [
  { id: APPLICATION_DETAILS_TAB.OVERVIEW, label: 'Overview' },
  { id: APPLICATION_DETAILS_TAB.CONFIGURATION, label: 'Configuration' },
  { id: APPLICATION_DETAILS_TAB.MONITORING_ENDPOINTS, label: 'Monitoring Endpoints' },
  { id: APPLICATION_DETAILS_TAB.BUILD_LOGS, label: 'Build Logs' },
  { id: APPLICATION_DETAILS_TAB.API_GATEWAYS, label: 'API Gateways' }
]

export const DEFAULT_APPLICATION_DETAILS_TAB = APPLICATION_DETAILS_TAB.OVERVIEW

export const OVERVIEW_FIELD = {
  NAME: 'Name',
  DIRECT_URLS: 'Direct URLs',
  INDIRECT_URLS: 'Indirect URLs',
  DESCRIPTION: 'Description',
  IMAGE: 'Image',
  SOURCE: 'Source',
  OWNER: 'Owner',
  TAG: 'Tag',
  UPDATED: 'Updated',
  INTERNAL_URLS: 'Internal URLs',
  COMMANDS: 'Commands',
  ARGUMENTS: 'Arguments'
}

export const LOGS_SECTION_KEY = {
  APPLICATION: 'application',
  FUNCTION: 'function'
}

export const BUILD_LOGS_POLLING_INTERVAL_MS = 2_000

export const COPY_RESET_TIMEOUT_MS = 2_000

export const FUNCTION_STATUS_HEADER = 'x-mlrun-function-status'

// Values mirror src/constants.js to avoid a cross-layer import from nextGenComponents into legacy.
export const TRANSIENT_FUNCTION_STATUSES = ['pending', 'running']

// Application state values (mirror src/utils/getState.js) used to gate build logs fetching.
export const APPLICATION_INITIALIZED_STATE = 'initialized'
export const APPLICATION_DEPLOYING_STATES = ['build', 'building', 'deploying', 'pending']

export const BUILD_LOGS_INITIALIZED_MESSAGE =
  'Build logs will be available once the application is deployed.'

export const VIEW_YAML_LABEL = 'View YAML'

export const API_GATEWAY_STATE = {
  READY: 'ready',
  ERROR: 'error',
  WAITING: 'waitingForProvisioning'
}

export const API_GATEWAY_STATE_LABEL = {
  [API_GATEWAY_STATE.READY]: 'Ready',
  [API_GATEWAY_STATE.ERROR]: 'Error',
  [API_GATEWAY_STATE.WAITING]: 'In process'
}

export const API_GATEWAY_STATE_CLASS = {
  [API_GATEWAY_STATE.READY]: 'state-deploying',
  [API_GATEWAY_STATE.ERROR]: 'state-failed',
  [API_GATEWAY_STATE.WAITING]: 'state-archived'
}

export { GATEWAY_RELATIONSHIP } from '../../../../utils/apiGateway.util'

export const NUCLIO_OWNER_LABEL = 'iguazio.com/username'

export const FORCE_SSL_REDIRECT_ANNOTATION = 'nginx.ingress.kubernetes.io/force-ssl-redirect'

export const API_GATEWAYS_FILTER_CONFIG = {
  name: { initialValue: '', label: 'Name' },
  owner: { initialValue: '', label: 'Owner' },
  authenticationMode: { initialValue: '', label: 'Auth Mode' }
}

export const API_GATEWAYS_NO_DATA_MESSAGE = 'No API gateways found for this application'

export const FILTER_ALL_OPTION = { value: 'all', label: 'All' }
export const FILTER_ALL_OPTION_VALUE = FILTER_ALL_OPTION.value
export const DEFAULT_NAME_SORTING = [{ id: 'name', desc: false }]
export const DEFAULT_CREATED_AT_SORTING = [{ id: 'createdAt', desc: true }]
