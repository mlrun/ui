/**
 * Dynamically loads the Mlrun proxy configuration for development.
 *
 * Returns an empty proxy in production.
 * In development, it imports the shared `mlrunProxyConfig` function
 * from the `iguazio.dashboard-react-controls` package and validates its export.
 *
 * Node cannot use the aliased import
 * (`import { mlrunProxyConfig } from 'igz-controls/utils/proxyServerConfig.util'`)
 * since Vite path aliases are resolved only at build time,
 * not during Node's module execution.
 */
import path from 'path'
import { pathToFileURL } from 'url'

export const loadMlrunProxyConfig = async mode => {
  const modulePath = path.resolve(
    'node_modules/iguazio.dashboard-react-controls/dist/utils/proxyServerConfig.util.mjs'
  )

  try {
    const moduleUrl = pathToFileURL(modulePath).href

    const { mlrunProxyConfig } = await import(moduleUrl)

    if (typeof mlrunProxyConfig !== 'function') {
      throw new Error('Invalid export: expected mlrunProxyConfig to be a function.')
    }

    return mlrunProxyConfig
  } catch (error) {
    if (process.env.PREVIEW_MODE === 'true' || mode === 'development') {
      throw new Error(`Failed to load mlrunProxyConfig: ${error.message}`)
    }

    return () => ({})
  }
}
