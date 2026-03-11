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

import { HTTP, HTTPS } from './constants'

const withProtocol = url => {
  if (!url || url.startsWith(HTTP) || url.startsWith(HTTPS)) return url
  return `${window.location.protocol}//${url.replace(/^\/+/, '')}`
}

export const loadRemoteConfig = async (url, services = {}) => {
  /**
   * Store host-provided services (auth bridge from igz-ui)
   */
  if (services && Object.keys(services).length > 0) {
    window.__mlrunHostServices = services
  }

  // Priority 1: Use config injected by the Host (igz-ui)
  if (window.mlrunConfig && Object.keys(window.mlrunConfig).length > 0) {
    window.mlrunConfig.nuclioUiUrl = withProtocol(window.mlrunConfig.nuclioUiUrl)
    window.mlrunConfig.nuclioRemoteEntryUrl = withProtocol(window.mlrunConfig.nuclioRemoteEntryUrl)
    return
  }

  // Priority 2: Standalone Fallback (Local Dev)
  try {
    const configPath = `${url ?? import.meta.env.VITE_PUBLIC_URL}/config.json`
    const response = await fetch(configPath, { cache: 'no-store' })
    if (!response.ok) throw new Error(response.status)

    const config = await response.json()
    const uiUrl = withProtocol(config.nuclioUiUrl)

    window.mlrunConfig = {
      ...config,
      nuclioUiUrl: uiUrl,
      nuclioRemoteEntryUrl: withProtocol(config.nuclioRemoteEntryUrl || uiUrl)
    }
  } catch (err) {
    throw new Error('[mlrun-ui] Config load failed. Falling back to Host injection.', err)
  }
}
