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
import { useCallback, useMemo, useState, useEffect } from 'react'

import { mainHttpClient } from '../httpClient'

const TOKEN_EXPIRY_WARNING_DAYS = 7
const DISMISSED_KEY = 'tokenExpiryBannerDismissed'

// Module-level cache — survives component remounts and MF unmount/remount cycles
let tokenCache = null

const isDismissed = () => sessionStorage.getItem(DISMISSED_KEY) === 'true'
const persistDismissed = () => sessionStorage.setItem(DISMISSED_KEY, 'true')

const getDaysDifference = targetDate => {
  const diffTime = new Date(targetDate).getTime() - Date.now()
  return diffTime / (1000 * 60 * 60 * 24)
}

const isTokenExpiringSoon = token => {
  if (!token.expiration) return false
  return getDaysDifference(token.expiration) <= TOKEN_EXPIRY_WARNING_DAYS
}

const useApiTokenExpiry = () => {
  const [tokens, setTokens] = useState(tokenCache)
  const [dismissed, setDismissedState] = useState(isDismissed)

  useEffect(() => {
    let cancelled = false

    mainHttpClient
      .get('/user-secrets/tokens')
      .then(({ data }) => {
        if (!cancelled) {
          const result = data.secret_tokens ?? []
          tokenCache = result
          setTokens(result)
        }
      })
      .catch(() => {
        // On error keep the cached value so the banner doesn't vanish
        if (!cancelled && tokenCache === null) setTokens([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  const hasExpiring = useMemo(
    () => !dismissed && !!tokens?.some(isTokenExpiringSoon),
    [tokens, dismissed]
  )

  const minDaysLeft = useMemo(() => {
    if (!hasExpiring || !tokens) return 0
    const expiring = tokens.filter(isTokenExpiringSoon)
    const min = Math.min(...expiring.map(t => getDaysDifference(t.expiration)))
    return Math.max(0, Math.ceil(min))
  }, [tokens, hasExpiring])

  const daysLeftLabel = minDaysLeft <= 1 ? '1 day' : `${minDaysLeft} days`

  const dismiss = useCallback(() => {
    persistDismissed()
    setDismissedState(true)
  }, [])

  return { hasExpiring, daysLeftLabel, dismiss }
}

export default useApiTokenExpiry
