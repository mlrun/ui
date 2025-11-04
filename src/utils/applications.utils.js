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
import { isArray, clone } from 'lodash'

import { ERROR_STATE, FUNCTION_READY_STATE, UNHEALTHY_STATE } from '../constants'

const OPERATING_FUNCTIONS_NAMES_LIST = [
  'model-monitoring-controller',
  'model-monitoring-stream',
  'model-monitoring-writer'
]
const NUCLIO_FUNCTIONS_MLRUN_TYPES = [
  'mlrun__model-monitoring-application',
  'mlrun__model-monitoring-infra'
]

export const splitApplicationsContent = (functions = []) => {
  const monitoringApplicationsData = {
    operatingFunctions: [],
    applications: []
  }
  let workingFunctions = clone(functions)

  if (!isArray(functions)) {
    workingFunctions = Object.values(functions).filter(app => {
      return NUCLIO_FUNCTIONS_MLRUN_TYPES.includes(app.metadata.labels['mlrun__type'])
    })
  }

  workingFunctions.forEach(func => {
    const funcName = func.name
      ? func.name
      : func.metadata.name.replace(`${func.metadata.labels['nuclio.io/project-name']}-`, '')

    if (OPERATING_FUNCTIONS_NAMES_LIST.includes(funcName)) {
      monitoringApplicationsData.operatingFunctions.push(func)
    } else {
      monitoringApplicationsData.applications.push(func)
    }
  })

  return monitoringApplicationsData
}

export const aggregateApplicationStatuses = monitoringApplications => {
  return monitoringApplications.reduce(
    (acc, application) => {
      const status = application.status.state ? application.status.state : application.status

      return {
        ready: acc.ready + (status === FUNCTION_READY_STATE ? 1 : 0),
        error: acc.error + ([ERROR_STATE, UNHEALTHY_STATE].includes(status) ? 1 : 0)
      }
    },
    { ready: 0, error: 0 }
  )
}
