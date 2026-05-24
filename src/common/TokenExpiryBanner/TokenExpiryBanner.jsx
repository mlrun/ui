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
import React from 'react'

import useApiTokenExpiry from '../../hooks/useApiTokenExpiry'

import WarningTriangle from './warningTriangle.svg?react'
import CloseIcon from './closeIcon.svg?react'

import './tokenExpiryBanner.scss'

const TokenExpiryBanner = () => {
  const { hasExpiring, daysLeftLabel, dismiss } = useApiTokenExpiry()

  if (!hasExpiring) return null

  const handleLinkClick = e => {
    e.preventDefault()
    const url = `${window.location.pathname}?settings=tokens`
    window.history.pushState(null, '', url)
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
  }

  return (
    <div className="token-expiry-banner" role="status" aria-live="polite">
      <WarningTriangle className="token-expiry-banner__icon" />

      <span className="token-expiry-banner__message">
        Your access token will expire in {daysLeftLabel}. Please renew it or create a new one under{' '}
        <a
          className="token-expiry-banner__link"
          href={`${window.location.pathname}?settings=tokens`}
          onClick={handleLinkClick}
        >
          API Tokens
        </a>
        .
      </span>

      <button className="token-expiry-banner__close" onClick={dismiss} aria-label="Dismiss">
        <CloseIcon />
      </button>
    </div>
  )
}

export default TokenExpiryBanner
