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
import { useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * Bridges host (mlrun-ui) navigation to a guard published by an embedded remote
 * (nuclio) on `window.__igzLeaveGuard`. Because this host owns its own router,
 * the remote's own `useBlocker` can't see navigations triggered from host chrome
 * (navbar, breadcrumbs, programmatic `navigate()`, Back/Forward). This blocker
 * runs inside the host router, so it catches all of them before they commit and
 * delegates the confirmation prompt back to the remote (which stays mounted
 * while the navigation is blocked).
 *
 * It is a no-op whenever no remote guard is registered.
 */
const HostLeaveGuard = () => {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    try {
      return Boolean(
        window.__igzLeaveGuard?.shouldBlock(currentLocation.pathname, nextLocation.pathname)
      )
    } catch {
      // Fail open: a broken/stale guard must never trap navigation.
      return false
    }
  })

  const blockerRef = useRef(blocker)
  useEffect(() => {
    blockerRef.current = blocker
  }, [blocker])

  useEffect(() => {
    if (blocker.state !== 'blocked') return

    let active = true
    const confirm = window.__igzLeaveGuard?.confirm

    Promise.resolve(confirm ? confirm() : true)
      .then(confirmed => {
        if (!active) return

        if (confirmed) {
          blockerRef.current.proceed?.()
        } else {
          blockerRef.current.reset?.()
        }
      })
      .catch(() => {
        // Fail open: never leave the user stuck if the prompt errors out.
        if (active) blockerRef.current.proceed?.()
      })

    return () => {
      active = false
    }
  }, [blocker.state])

  return null
}

export default HostLeaveGuard
