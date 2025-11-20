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
 * { isDemoMode: false, isStagingMode: true }
 */

export const useMode = () => {
  const [mode, setMode] = useState(localStorageService.getStorageValue('mode'))
  const urlMode = getUrlMode(window.location.search)

  useLayoutEffect(() => {
    if (urlMode && urlMode !== mode) {
      localStorageService.setStorageValue('mode', urlMode)
      queueMicrotask(() => setMode(urlMode))
    }
  }, [mode, urlMode])

  return {
    isDemoMode: mode === 'demo',
    isStagingMode: mode === 'staging' || mode === 'demo'
  }
}

// mode = "demo" | "staging"
