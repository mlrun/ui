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
import { loadRemote, registerRemotes } from '@module-federation/runtime'

let registerPromise = null

const ensureNuclioRemote = async () => {
  if (registerPromise) return registerPromise

  const config = window?.mlrunConfig
  let remoteEntryUrl = config?.nuclioRemoteEntryUrl

  if (!remoteEntryUrl) {
    throw new Error('[MF] Missing window.mlrunConfig.nuclioRemoteEntryUrl')
  }

  if (window.location.hostname !== 'localhost') {
    remoteEntryUrl = `${remoteEntryUrl.replace(/\/$/, '')}/nuclio-ui`
  } else {
    remoteEntryUrl = remoteEntryUrl.replace(/\/$/, '')
  }

  registerPromise = (async () => {
    try {
      registerRemotes([
        {
          name: 'nuclio',
          entry: `${remoteEntryUrl.replace(/\/$/, '')}/remoteEntry.js`,
          type: 'module',
          shareScope: 'default'
        }
      ])
    } catch (err) {
      registerPromise = null
      throw err
    }
  })()

  return registerPromise
}

const loadNuclioApp = async () => {
  await ensureNuclioRemote()
  const module = await loadRemote('nuclio/App')

  if (!module) throw new Error('[MF] Failed to load Nuclio application')

  const component = module.default?.default || module.default || module
  return { default: component }
}

export { ensureNuclioRemote, loadNuclioApp }
