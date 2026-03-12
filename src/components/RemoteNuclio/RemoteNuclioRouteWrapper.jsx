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
import React, { useEffect, useState, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ensureNuclioRemote, loadNuclioApp } from '../../utils/nuclio.remotes.utils'
import NuclioRemoteError from './NuclioRemoteError'
import { Loader } from 'igz-controls/components'

import './RemoteNuclio.scss'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

const RemoteNuclioApp = React.lazy(() => loadNuclioApp())

const RemoteNuclioRouteWrapper = () => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const origPushState = history.pushState
    const origReplaceState = history.replaceState

    history.pushState = function (...args) {
      origPushState.apply(this, args)
      Promise.resolve().then(() => {
        window.dispatchEvent(new PopStateEvent('popstate'))
      })
    }

    history.replaceState = function (...args) {
      origReplaceState.apply(this, args)
      Promise.resolve().then(() => {
        window.dispatchEvent(new PopStateEvent('popstate'))
      })
    }

    return () => {
      history.pushState = origPushState
      history.replaceState = origReplaceState
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        await ensureNuclioRemote()
        setReady(true)
      } catch {
        setError(true)
      }
    }
    void init()
  }, [])

  const renderContent = () => {
    if (error) {
      return <NuclioRemoteError />
    }

    if (!ready) {
      return (
        <div className="flex-center">
          <Loader />
        </div>
      )
    }

    return (
      <ErrorBoundary fallback={<NuclioRemoteError />}>
        <Suspense
          fallback={
            <div className="flex-center">
              <Loader />
            </div>
          }
        >
          <div className="nuclio-app-wrapper">
            <div className="content__header">
              <Breadcrumbs />
            </div>
            <RemoteNuclioApp />
          </div>
        </Suspense>
      </ErrorBoundary>
    )
  }

  return <div className="remote-nuclio-container">{renderContent()}</div>
}

export default RemoteNuclioRouteWrapper
