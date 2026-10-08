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
import alertsReducer, { fetchAlerts, removeAlerts } from './alertsReducer'

const arg = { project: 'p', filters: {}, config: {} }

describe('alertsReducer stale-response protection', () => {
  it('keeps loading true across an abort until the request that superseded it settles', () => {
    let state = alertsReducer(undefined, { type: '@@INIT' })

    state = alertsReducer(state, fetchAlerts.pending('requestA', arg))
    expect(state.loading).toBe(true)

    state = alertsReducer(state, fetchAlerts.pending('requestB', arg))
    expect(state.loading).toBe(true)

    state = alertsReducer(state, fetchAlerts.rejected(new Error('canceled'), 'requestA', arg))
    expect(state.loading).toBe(true)

    state = alertsReducer(state, fetchAlerts.fulfilled([{ id: '1' }], 'requestB', arg))
    expect(state.loading).toBe(false)
    expect(state.alerts).toEqual([{ id: '1' }])
  })

  it('does not restore stale alerts when an already-superseded request settles after removeAlerts', () => {
    let state = alertsReducer(undefined, { type: '@@INIT' })

    state = alertsReducer(state, fetchAlerts.pending('requestA', arg))

    state = alertsReducer(state, removeAlerts())
    expect(state.alerts).toEqual([])

    state = alertsReducer(state, fetchAlerts.fulfilled([{ id: 'stale' }], 'requestA', arg))

    expect(state.alerts).toEqual([])
  })
})
