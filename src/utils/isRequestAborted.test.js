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
import { isRequestAborted } from './isRequestAborted'

describe('isRequestAborted', () => {
  it('returns false for falsy input', () => {
    expect(isRequestAborted(null)).toBe(false)
    expect(isRequestAborted(undefined)).toBe(false)
    expect(isRequestAborted('')).toBe(false)
  })

  it.each(['Request canceled', 'canceled', 'Large request canceled'])(
    'returns true for the "%s" message string',
    message => {
      expect(isRequestAborted(message)).toBe(true)
    }
  )

  it('returns false for an unrelated message string', () => {
    expect(isRequestAborted('Network Error')).toBe(false)
  })

  it.each(['Request canceled', 'canceled', 'Large request canceled'])(
    'returns true for an error-like object with message "%s"',
    message => {
      expect(isRequestAborted({ message })).toBe(true)
    }
  )

  it('returns true for an Axios CanceledError (code ERR_CANCELED)', () => {
    expect(isRequestAborted({ code: 'ERR_CANCELED', message: 'canceled' })).toBe(true)
  })

  it('returns true for the { aborted: true } rejectWithValue payload shape', () => {
    expect(isRequestAborted({ aborted: true })).toBe(true)
  })

  it('returns false for a real error object', () => {
    expect(isRequestAborted({ message: 'Network Error', code: 'ERR_NETWORK' })).toBe(false)
    expect(isRequestAborted({ aborted: false, message: 'Network Error' })).toBe(false)
  })
})
