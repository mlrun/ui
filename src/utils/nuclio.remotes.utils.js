import { loadRemote, registerRemotes } from '@module-federation/runtime'

let registerPromise = null

const ensureNuclioRemote = async () => {
  if (registerPromise) return registerPromise

  const remoteEntryUrl = window?.mlrunConfig?.nuclioRemoteEntryUrl

  if (!remoteEntryUrl) {
    throw new Error('[MF] Missing window.mlrunConfig.nuclioRemoteEntryUrl')
  }

  registerPromise = (async () => {
    try {
      registerRemotes([
        {
          name: 'nuclio',
          entry: `${remoteEntryUrl}/remoteEntry.js`,
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

  if (!module) {
    throw new Error('[MF] Failed to load Nuclio application')
  }

  const component = module.default?.default || module.default || module
  return { default: component }
}

export { ensureNuclioRemote, loadNuclioApp }
