import { useLayoutEffect, useState } from 'react'
import localStorageService from '../utils/localStorageService'
import { getUrlMode } from '../utils/helper'

/**
 * @hook
 * Returns an appliction `mode` object
 *
 * isDemoMode = Not ready for production or testing (Missing UI or BE). shows all the code for staging + demo
 *
 * isStagingMode = When ready for testing but not for production. Specific for staging
 *
 * @returns {{isDemoMode: boolean, isStagingMode: boolean}}
 *
 * @example
 *
 * { isDemoMode: boolean, isStagingMode: boolean}
 */

export const useMode = () => {
  const [mode, setMode] = useState(localStorageService.getStorageValue('mode'))
  const urlMode = getUrlMode(window.location.search)

  useLayoutEffect(() => {
    if (urlMode) {
      localStorageService.setStorageValue('mode', JSON.stringify(urlMode))
      setMode(urlMode)
    }
  }, [urlMode])

  return {
    isDemoMode: mode === 'demo',
    isStagingMode: mode === 'staging' || mode === 'demo'
  }
}

// mode = "demo" | "staging"
