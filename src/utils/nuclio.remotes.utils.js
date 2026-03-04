import { loadRemote, registerRemotes } from '@module-federation/runtime'

let registerPromise = null

const ensureNuclioRemote = async () => {
  if (registerPromise) return registerPromise

  const config = window?.mlrunConfig
  let remoteEntryUrl = config?.nuclioRemoteEntryUrl

  if (!remoteEntryUrl) {
    throw new Error('[MF] Missing window.mlrunConfig.nuclioRemoteEntryUrl')
  }

  /**
   * FIX: Ensure the URL contains the /nuclio-ui proxy path.
   * If it's just the domain, append the required prefix.
   */
  if (!remoteEntryUrl.includes('/nuclio-ui')) {
    remoteEntryUrl = `${remoteEntryUrl.replace(/\/$/, '')}/nuclio-ui`
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
