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
import { isStaleRequest, requestPending, requestSettled } from './redux.util'

const pendingAction = requestId => ({ meta: { requestId } })
const settledAction = requestId => ({ meta: { requestId } })

describe('requestPending / requestSettled / isStaleRequest', () => {
  it('resolves loading only once every outstanding request has settled', () => {
    const slice = {}

    requestPending(slice, pendingAction('A'))
    expect(slice.loading).toBe(true)

    requestPending(slice, pendingAction('B'))
    expect(slice.loading).toBe(true)

    requestSettled(slice, settledAction('A'))
    expect(slice.loading).toBe(true)

    requestSettled(slice, settledAction('B'))
    expect(slice.loading).toBe(false)
  })

  it('never corrupts into NaN or a negative value when a request settles after the slice was reset', () => {
    let slice = {}

    requestPending(slice, pendingAction('A'))
    expect(slice.loading).toBe(true)

    slice = {}

    requestSettled(slice, settledAction('A'))
    expect(slice.loading).toBe(false)
    expect(slice.pendingRequestIds).toEqual([])
    expect(slice.pendingRequestIds.length).not.toBeNaN()

    requestPending(slice, pendingAction('B'))
    expect(slice.loading).toBe(true)
    requestSettled(slice, settledAction('B'))
    expect(slice.loading).toBe(false)
  })

  it('flags every request except the most recently dispatched one as stale', () => {
    const slice = {}

    requestPending(slice, pendingAction('A'))
    expect(isStaleRequest(slice, settledAction('A'))).toBe(false)

    requestPending(slice, pendingAction('B'))
    expect(isStaleRequest(slice, settledAction('A'))).toBe(true)
    expect(isStaleRequest(slice, settledAction('B'))).toBe(false)
  })

  it('treats every request as stale after a reset, until a new one is dispatched', () => {
    let slice = {}
    requestPending(slice, pendingAction('A'))

    slice = {}
    expect(isStaleRequest(slice, settledAction('A'))).toBe(true)
  })

  it('supports several independent thunks sharing one aggregate loading flag', () => {
    const slice = {}

    requestPending(slice, pendingAction('models-1'))
    requestPending(slice, pendingAction('artifacts-1'))
    expect(slice.loading).toBe(true)

    requestSettled(slice, settledAction('models-1'))
    expect(slice.loading).toBe(true)

    requestSettled(slice, settledAction('artifacts-1'))
    expect(slice.loading).toBe(false)
  })
})
