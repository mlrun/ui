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
import { lazy } from 'react'
// a function to retry loading a chunk to avoid chunk load error for out of date code
export const lazyRetry = componentImport =>
  lazy(() => {
    return new Promise((resolve, reject) => {
      // check if the window has already been refreshed
      const hasRefreshed = JSON.parse(
        window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
      )
      // try to import the component
      componentImport()
        .then(component => {
          window.sessionStorage.setItem('retry-lazy-refreshed', 'false') // success so reset the refresh
          resolve(component)
        })
        .catch(error => {
          if (!hasRefreshed) {
            // not been refreshed yet
            window.sessionStorage.setItem('retry-lazy-refreshed', 'true') // we are now going to refresh
            return window.location.reload() // refresh the page
          }
          reject(error) // Default error behaviour as already tried refresh
        })
    })
  })
