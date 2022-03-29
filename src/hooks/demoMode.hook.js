import { useLayoutEffect, useState } from 'react'
import localStorageService from '../utils/localStorageService'
import { isURLMode } from '../utils/helper'

/**
 * @hook
 * Returns an appliction `mode` object
 *
 * isDemoMode = Not ready for production or testing (Missing UI or BE). shows all the code for staging + demo
 *
 * isStagingMode = When ready for testing but not for production. Specific for staging
 *
 * @returns {Object} Object
 *
 * @example
 *
 * { isDemoMode: true | false, isStagingMode: true | false}
 */

export const useMode = () => {
  const [mode, setMode] = useState(localStorageService.getStorageValue('mode'))
  const urlMode = isURLMode(window.location.search)

  useLayoutEffect(() => {
    if (urlMode) {
      localStorageService.setStorageValue('mode', urlMode)
      setMode(urlMode)
    }
  }, [urlMode])

  return {
    isDemoMode: mode === 'demo' || false,
    isStagingMode: mode === 'staging' || mode === 'demo' || false
  }
}

// mode = "demo" | "staging"
