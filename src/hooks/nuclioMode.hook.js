import { useLayoutEffect, useState } from 'react'

/**
 * @hook
 * Returns a Nuclio `mode` object
 *
 * isNuclioModeDisabled = The Nuclio backend is not deployed
 *
 * @returns {{isNuclioModeDisabled: boolean}}
 *
 * @example
 *
 * { isNuclioModeDisabled: true }
 */

export const useNuclioMode = () => {
  const [mode, setMode] = useState(window.mlrunConfig.nuclioMode)

  useLayoutEffect(() => {
    if (mode !== window.mlrunConfig.nuclioMode) {
      setMode(window.mlrunConfig.nuclioMode)
    }
  }, [mode])

  return {
    isNuclioModeDisabled: mode === 'disabled'
  }
}
