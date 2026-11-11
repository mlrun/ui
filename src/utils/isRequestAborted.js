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
import { DEFAULT_ABORT_MSG, LARGE_REQUEST_CANCELED, REQUEST_CANCELED } from '../constants'

const ABORT_MESSAGES = [REQUEST_CANCELED, DEFAULT_ABORT_MSG, LARGE_REQUEST_CANCELED]

// Accepts either a message string (legacy call sites) or an error/action.payload
// object, so it can also recognize Axios' ERR_CANCELED code and the { aborted: true }
// shape produced by thunks that go through rejectWithValue.
export const isRequestAborted = errorOrMessage => {
  if (!errorOrMessage) return false

  if (typeof errorOrMessage === 'string') {
    return ABORT_MESSAGES.includes(errorOrMessage)
  }

  return (
    errorOrMessage.aborted === true ||
    errorOrMessage.code === 'ERR_CANCELED' ||
    ABORT_MESSAGES.includes(errorOrMessage.message)
  )
}
