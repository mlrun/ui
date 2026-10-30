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
import { isEmpty } from 'lodash-es'

import { getNuclioFuncState } from './getNuclioFuncState'
import getState from './getState'
import { filterGatewaysByFunction, buildGatewayUrl, GATEWAY_RELATIONSHIP } from './apiGateway.util'
import {
  ERROR_STATE,
  FUNCTION_BUILDING_STATE,
  FUNCTION_READY_STATE,
  FUNCTION_RUNNING_STATE,
  FUNCTIONS_PAGE,
  UNHEALTHY_STATE
} from '../constants'
const NUCLIO_FUNCTIONS_STATE_KIND = 'nuclioFunctions'
const NUCLIO_USERNAME_LABEL = 'iguazio.com/username'
const NUCLIO_DOMAIN_LABEL = 'iguazio.com/domain'

export const buildNuclioOwner = labels => {
  const username = labels?.[NUCLIO_USERNAME_LABEL]
  const domain = labels?.[NUCLIO_DOMAIN_LABEL]

  return domain ? `${username}@${domain}` : (username ?? '')
}

const buildEndpointsCountMap = modelEndpoints => {
  const countMap = {}

  for (const endpoint of modelEndpoints) {
    const functionName = endpoint.spec?.function_name ?? ''
    const functionTag = endpoint.spec?.function_tag ?? ''

    if (!functionName) continue

    const key = `${functionName}:${functionTag}`
    countMap[key] = (countMap[key] || 0) + 1
  }

  return countMap
}

export const enrichFunctionsWithNuclio = (
  parsedFunctions,
  nuclioFunctionsMap,
  projectApiGateways = [],
  modelEndpoints = []
) => {
  const endpointsCountMap = buildEndpointsCountMap(modelEndpoints)

  return parsedFunctions.map(func => {
    const nuclioKey = func.nuclio_name || `${func.project}-${func.name}`
    const nuclioFunc = nuclioFunctionsMap[nuclioKey] || {}

    const nuclioFuncState = !isEmpty(nuclioFunc)
      ? (getNuclioFuncState(nuclioFunc) || '').toLowerCase()
      : ''

    const state = nuclioFuncState || func.state?.value || ''
    const owner = buildNuclioOwner(nuclioFunc?.metadata?.labels)

    const applicationGateways = filterGatewaysByFunction(
      projectApiGateways,
      func.project,
      func.name,
      func.tag
    )

    const directUrls = []
    const indirectUrls = []

    for (const gateway of applicationGateways) {
      const url = buildGatewayUrl(gateway)
      if (!url) continue

      if (gateway.relationship === GATEWAY_RELATIONSHIP.DIRECT) {
        directUrls.push(url)
      } else {
        indirectUrls.push(url)
      }
    }

    if (directUrls.length === 0 && indirectUrls.length === 0) {
      indirectUrls.push(...(func.external_invocation_urls ?? []))
    }

    const endpointsCount = endpointsCountMap[`${func.name}:${func.tag}`] ?? 0

    return {
      ...func,
      state: getState(state, FUNCTIONS_PAGE, NUCLIO_FUNCTIONS_STATE_KIND),
      owner,
      nuclioFunc,
      applicationGateways,
      directUrls,
      indirectUrls,
      endpointsCount
    }
  })
}

export const computeCounters = functions => {
  let running = 0
  let failed = 0
  let building = 0

  for (const func of functions) {
    const stateValue = func.state?.value
    if (stateValue === FUNCTION_READY_STATE || stateValue === FUNCTION_RUNNING_STATE) {
      running += 1
    } else if (stateValue === ERROR_STATE || stateValue === UNHEALTHY_STATE) {
      failed += 1
    } else if (stateValue === FUNCTION_BUILDING_STATE) {
      building += 1
    }
  }

  return { total: functions.length, running, failed, building }
}
