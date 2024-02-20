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
import { FUNCTION_INITIALIZED_STATE, FUNCTIONS_PAGE } from '../constants'

const getState = (state, page, kind) => {
  const stateExists = !isEmpty(state)

  if (page === FUNCTIONS_PAGE) {
    return {
      value: stateExists ? state : FUNCTION_INITIALIZED_STATE,
      label: stateExists ? functionStateLabels[state] : 'Initialized',
      className: `state-${stateExists ? state : FUNCTION_INITIALIZED_STATE}${
        kind ? '-' + kind : ''
      }`
    }
  } else {
    return {
      value: state ?? null,
      label: state ? commonStateLabels[state] : '',
      className: `state${state ? '-' + state : ''}${kind ? '-' + kind : ''}`
    }
  }
}

const commonStateLabels = {
  aborted: 'Aborted',
  aborting: 'Aborting',
  active: 'Active',
  completed: 'Completed',
  created: 'Created',
  creating: 'Creating',
  error: 'Error',
  fail: 'Error',
  failed: 'Error',
  omitted: 'Omitted',
  pending: 'Pending',
  ready: 'Ready',
  running: 'Running',
  succeeded: 'Completed'
}

const functionStateLabels = {
  build: 'Deploying',
  deploying: 'Deploying',
  error: 'Error',
  failed: 'Error',
  omitted: 'Omitted',
  pending: 'Deploying',
  ready: 'Ready',
  running: 'Running',
  succeeded: 'Succeeded'
}

export default getState
