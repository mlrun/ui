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
import { CANCEL_REQUEST_TIMEOUT, LARGE_REQUEST_CANCELED, PROJECTS_PAGE_PATH } from './constants'
import { openPopUp } from 'igz-controls/utils/common.util'
import { mlrunUnhealthyErrors } from './components/ProjectsPage/projects.util'

const headers = {
  'Cache-Control': 'no-cache'
}

// serialize a param with an array value as a repeated param, for example:
// { label: ['host', 'owner=admin'] } => 'label=host&label=owner%3Dadmin'
const paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' })

const MAX_CONSECUTIVE_ERRORS_COUNT = 2
let consecutiveErrorsCount = 0

export const mainBaseUrl = `${process.env.PUBLIC_URL}/api/v1`
export const mainBaseUrlV2 = `${process.env.PUBLIC_URL}/api/v2`

export const mainHttpClient = axios.create({
  baseURL: mainBaseUrl,
  headers,
  paramsSerializer
})

export const mainHttpClientV2 = axios.create({
  baseURL: mainBaseUrlV2,
  headers,
  paramsSerializer
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

const getAbortSignal = (controller, abortCallback, timeoutMs) => {
  let timeoutId = null
  const newController = new AbortController()
  const abortController = controller || newController

  if (timeoutMs) {
    timeoutId = setTimeout(() => abortController.abort(LARGE_REQUEST_CANCELED), timeoutMs)
  }

  abortController.signal.onabort = event => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (abortCallback) {
      abortCallback(event)
    }
  }

  return [abortController.signal, timeoutId]
}

let requestId = 1
let requestTimeouts = {}
let largeResponsePopUpIsOpen = false

const requestLargeDataOnFulfill = config => {
  if (config?.ui?.setLargeRequestErrorMessage) {
    const [signal, timeoutId] = getAbortSignal(
      config.ui?.controller,
      abortEvent => {
        if (abortEvent.target.reason === LARGE_REQUEST_CANCELED) {
          showLargeResponsePopUp(config.ui.setLargeRequestErrorMessage)
        }
      },
      CANCEL_REQUEST_TIMEOUT
    )

    config.signal = signal

    requestTimeouts[requestId] = timeoutId
    config.ui.requestId = requestId
    requestId++
  }

  return config
}
const requestLargeDataOnReject = error => {
  return Promise.reject(error)
}
const responseFulfillInterceptor = response => {
  consecutiveErrorsCount = 0

  if (response.config?.ui?.requestId) {
    const isLargeResponse =
      response.data?.total_size >= 0
        ? response.data.total_size > 10000
        : Object.values(response.data)?.[0]?.length > 10000

    clearTimeout(requestTimeouts[response.config.ui.requestId])
    delete requestTimeouts[response.config.ui.requestId]

    if (isLargeResponse) {
      showLargeResponsePopUp(response.config.ui.setLargeRequestErrorMessage)

      throw new Error(LARGE_REQUEST_CANCELED)
    } else {
      response.config.ui.setLargeRequestErrorMessage('')
    }
  }

  return response
}
const responseRejectInterceptor = error => {
  if (error.config?.ui?.requestId) {
    clearTimeout(requestTimeouts[error.config.ui.requestId])
    delete requestTimeouts[error.config.ui.requestId]
  }

  if (error.config?.method === 'get') {
    if (mlrunUnhealthyErrors.includes(error.response?.status) && consecutiveErrorsCount < MAX_CONSECUTIVE_ERRORS_COUNT) {
      consecutiveErrorsCount++

      if (consecutiveErrorsCount === MAX_CONSECUTIVE_ERRORS_COUNT && window.location.pathname !== `/${PROJECTS_PAGE_PATH}`) {
        window.location.href = '/projects'
      }
    }
  }

  return Promise.reject(error)
}


// Request interceptors
mainHttpClient.interceptors.request.use(requestLargeDataOnFulfill, requestLargeDataOnReject)
mainHttpClientV2.interceptors.request.use(requestLargeDataOnFulfill, requestLargeDataOnReject)

// Response interceptors
mainHttpClient.interceptors.response.use(responseFulfillInterceptor, responseRejectInterceptor)
mainHttpClientV2.interceptors.response.use(responseFulfillInterceptor, responseRejectInterceptor)

export const showLargeResponsePopUp = setLargeRequestErrorMessage => {
  if (!largeResponsePopUpIsOpen) {
    const errorMessage =
      'The query result is too large to display. Add a filter (or narrow it) to retrieve fewer results.'

    setLargeRequestErrorMessage(errorMessage)
    largeResponsePopUpIsOpen = true

    openPopUp(ConfirmDialog, {
      message: errorMessage,
      closePopUp: () => {
        largeResponsePopUpIsOpen = false
      }
    })
  }
}
