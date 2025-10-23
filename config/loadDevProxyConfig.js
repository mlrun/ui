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
import path from 'path'

/**
 * Dynamically loads the Mlrun proxy configuration for development.
 *
 * Returns an empty proxy configuration in production.
 * In development, it imports the shared `mlrunProxyConfig` function
 * from the `iguazio.dashboard-react-controls` package and validates its export.
 *
 * Node cannot use the aliased import
 * (`import { mlruroxyConfig } from 'igz-controls/utils/proxyServerConfig.util'`)
 * since Vite path aliases are resolved only during the build process
 * and are not recognized in Node’s module resolution context.
 */
export const loadMlrunProxyConfig = async () => {
  const modulePath = path.resolve(
    'node_modules/iguazio.dashboard-react-controls/dist/utils/proxyServerConfig.util.mjs'
  )
  try {
    const { mlrunProxyConfig } = await import(modulePath)

    if (typeof mlrunProxyConfig !== 'function') {
      throw new Error('Invalid export: expected mlrunProxyConfig to be a function.')
    }

    return mlrunProxyConfig
  } catch {
    return () => ({})
  }
}
