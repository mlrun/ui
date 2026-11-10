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

export const GATEWAY_RELATIONSHIP = {
  DIRECT: 'Direct',
  INDIRECT: 'Indirect'
}

export const buildGatewayEndpoint = gateway => {
  const host = gateway.spec?.host ?? ''
  const path = gateway.spec?.path ?? ''

  if (!host) return ''

  return path && path !== '/' ? `${host}/${path}` : host
}

export const buildGatewayUrl = gateway => {
  const endpoint = buildGatewayEndpoint(gateway)
  if (!endpoint) return ''
  return endpoint.startsWith('http') ? endpoint : `https://${endpoint}`
}

export const buildMatchNames = (projectName, functionName, functionTag) => {
  const names = new Set()

  names.add(`${projectName}/${functionName}`)
  names.add(`${projectName}-${functionName}`)
  names.add(functionName)

  if (functionTag) {
    names.add(`${projectName}/${functionName}:${functionTag}`)
    names.add(`${projectName}-${functionName}:${functionTag}`)
    names.add(`${functionName}:${functionTag}`)
  }

  return names
}

export const filterGatewaysByFunction = (gateways, projectName, functionName, functionTag) => {
  const matchNames = buildMatchNames(projectName, functionName, functionTag)

  return gateways.reduce((result, gateway) => {
    const upstreams = gateway.spec?.upstreams ?? []
    const matchingUpstream = upstreams.find(upstream => {
      const upstreamName = upstream.nucliofunction?.name ?? ''

      if (matchNames.has(upstreamName)) return true

      const nameWithoutTag = upstreamName.split(':')[0]
      return nameWithoutTag !== upstreamName && matchNames.has(nameWithoutTag)
    })

    if (matchingUpstream) {
      const hasDirectPort = Boolean(matchingUpstream.port)

      result.push({
        ...gateway,
        relationship: hasDirectPort ? GATEWAY_RELATIONSHIP.DIRECT : GATEWAY_RELATIONSHIP.INDIRECT,
        matchedUpstream: matchingUpstream
      })
    }

    return result
  }, [])
}

/** @public Not wired up yet (Application runtime screen). */
export const computeGatewayUrls = (gateways, projectName, functionName, functionTag) => {
  const matched = filterGatewaysByFunction(gateways, projectName, functionName, functionTag)
  const directUrls = []
  const indirectUrls = []

  for (const gateway of matched) {
    const url = buildGatewayUrl(gateway)
    if (!url) continue

    if (gateway.relationship === GATEWAY_RELATIONSHIP.DIRECT) {
      directUrls.push(url)
    } else {
      indirectUrls.push(url)
    }
  }

  return { directUrls, indirectUrls }
}
