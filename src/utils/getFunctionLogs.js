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
  FUNCTIONS_READY_STATES,
  TRANSIENT_FUNCTION_STATUSES
} from '../components/FunctionsPage/functions.util'
import { TAG_LATEST } from '../constants'
import { fetchFunctionLogs, fetchFunctionNuclioLogs } from '../reducers/functionReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const isFunctionTransient = response => {
  return TRANSIENT_FUNCTION_STATUSES.includes(response.headers?.['x-mlrun-function-status'])
}

const clearLogsTimeout = timeoutRef => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }
}

export const getFunctionLogs = (
  dispatch,
  fetchFunctionLogsTimeout,
  projectName,
  name,
  tag,
  setDetailsLogs,
  navigate,
  refreshFunctions,
  startedDeploying
) => {
  dispatch(fetchFunctionLogs({ project: projectName, name, tag }))
    .unwrap()
    .then(response => {
      if (isFunctionTransient(response)) {
        clearLogsTimeout(fetchFunctionLogsTimeout)

        fetchFunctionLogsTimeout.current = setTimeout(() => {
          getFunctionLogs(
            dispatch,
            fetchFunctionLogsTimeout,
            projectName,
            name,
            tag,
            setDetailsLogs,
            navigate,
            refreshFunctions,
            true
          )
        }, 2000)
      } else {
        if (
          FUNCTIONS_READY_STATES.includes(response.headers?.['x-mlrun-function-status']) &&
          startedDeploying
        ) {
          refreshFunctions().then(response => {
            const hash = response.find(item => item.name === name && item.tag === TAG_LATEST).hash

            if (hash) {
              navigate(
                `/projects/${projectName}/functions/${hash}/build-log${window.location.search}`
              )
            }
          })
        }

        clearTimeout(fetchFunctionLogsTimeout.current)
      }

      setDetailsLogs(response.data || '')
    })
    .catch(error => {
      showErrorNotification(dispatch, error, "Function's logs failed to load")
    })
}

export const getFunctionNuclioLogs = (
  dispatch,
  fetchFunctionNuclioLogsTimeoutRef,
  projectName,
  name,
  tag,
  setDetailsLogs
) => {
  dispatch(fetchFunctionNuclioLogs({ project: projectName, name, tag }))
    .unwrap()
    .then(response => {
      if (isFunctionTransient(response)) {
        clearLogsTimeout(fetchFunctionNuclioLogsTimeoutRef)

        fetchFunctionNuclioLogsTimeoutRef.current = setTimeout(() => {
          getFunctionNuclioLogs(
            dispatch,
            fetchFunctionNuclioLogsTimeoutRef,
            projectName,
            name,
            tag,
            setDetailsLogs
          )
        }, 2000)
      }

      setDetailsLogs(response.data || '')
    })
    .catch(error => {
      showErrorNotification(dispatch, error, "Function's logs failed to load")
    })
}
