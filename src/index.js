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
import ReactDOM, { createPortal } from 'react-dom'
import ModalContainer from 'react-modal-promise'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import toolkitStore from './store/toolkitStore'

fetch(`${process.env.PUBLIC_URL}/config.json`, { cache: 'no-store' })
  .then(response => response.json())
  .then(json => {
    window.mlrunConfig = json
  })
  .then(() => {
    ReactDOM.render(
      <Provider store={toolkitStore}>
        <Router basename={process.env.PUBLIC_URL}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          {createPortal(<ModalContainer />, document.getElementById('overlay_container'))}
        </Router>
      </Provider>,
      document.getElementById('root')
    )
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
