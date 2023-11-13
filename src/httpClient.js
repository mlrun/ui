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
import axios from 'axios'
import qs from 'qs'
import { ConfirmDialog } from 'igz-controls/components'

import { openPopUp } from 'igz-controls/utils/common.util'
import { REQUEST_CANCELED } from './constants'

const headers = {
  'Cache-Control': 'no-cache'
}
export const mainBaseUrl = `${process.env.PUBLIC_URL}/api/v1`

export const mainHttpClient = axios.create({
  baseURL: mainBaseUrl,
  headers,

  // serialize a param with an array value as a repeated param, for example:
  // { label: ['host', 'owner=admin'] } => 'label=host&label=owner%3Dadmin'
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

export const functionTemplatesHttpClient = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/function-catalog`,
  headers
})

export const nuclioHttpClient = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/nuclio/api`,
  headers
})

export const iguazioHttpClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : '/iguazio/api',
  headers
})

let requestCounter = 1
let requestTimeouts = {}

// Request interceptor
mainHttpClient.interceptors.request.use(
  config => {
    if (config.setLargeRequestErrorMessage) {
      requestTimeouts[requestCounter] = setTimeout(() => {
        showLargeResponsePopUp()
        throw new axios.Cancel(REQUEST_CANCELED)
      }, 30000)

      config.requestCounter = requestCounter
      requestCounter++
    }

    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
mainHttpClient.interceptors.response.use(
  response => {
    if (response.config.requestCounter) {
      const { requestCounter } = response.config
      const isLargeResponse = response.data?.total_size
        ? response.data.total_size > 1500
        : Object.values(response.data)[0].length > 1500

      clearTimeout(requestTimeouts[requestCounter])
      delete requestTimeouts[requestCounter]

      if (isLargeResponse) {
        showLargeResponsePopUp(response.config.setLargeRequestErrorMessage)

        throw new Error(REQUEST_CANCELED)
      } else {
        response.config.setLargeRequestErrorMessage('')
      }
    }

    return response
  },
  error => Promise.reject(error)
)

export const showLargeResponsePopUp = setLargeRequestErrorMessage => {
  const errorMessage =
    'The query result is too large to display. Add a filter (or narrow it) to retrieve fewer results.'

  setLargeRequestErrorMessage(errorMessage)
  openPopUp(ConfirmDialog, {
    message: errorMessage
  })
}
