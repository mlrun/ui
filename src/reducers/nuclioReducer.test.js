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
import nuclioReducer, {
  clearProjectApiGateways,
  fetchNuclioFunctions,
  fetchProjectApiGateways
} from './nuclioReducer'

const arg = { project: 'p', signal: undefined }

describe('nuclioReducer fetchNuclioFunctions loading counter', () => {
  it('keeps loading true across an abort until the request that superseded it settles', () => {
    let state = nuclioReducer(undefined, { type: '@@INIT' })

    state = nuclioReducer(state, fetchNuclioFunctions.pending('requestA', arg))
    expect(state.loading).toBe(true)

    state = nuclioReducer(state, fetchNuclioFunctions.pending('requestB', arg))
    expect(state.loading).toBe(true)

    state = nuclioReducer(
      state,
      fetchNuclioFunctions.rejected(new Error('canceled'), 'requestA', arg)
    )
    expect(state.loading).toBe(true)
    expect(state.currentProjectFunctions).toEqual([])

    state = nuclioReducer(state, fetchNuclioFunctions.fulfilled([{ name: 'f' }], 'requestB', arg))
    expect(state.loading).toBe(false)
    expect(state.currentProjectFunctions).toEqual([{ name: 'f' }])
  })
})

describe('nuclioReducer fetchProjectApiGateways (single caller, data guarded)', () => {
  it('keeps loading true across an abort and ignores the stale response', () => {
    let state = nuclioReducer(undefined, { type: '@@INIT' })

    state = nuclioReducer(state, fetchProjectApiGateways.pending('requestA', arg))
    state = nuclioReducer(state, fetchProjectApiGateways.pending('requestB', arg))
    expect(state.projectApiGatewaysLoading).toBe(true)

    state = nuclioReducer(
      state,
      fetchProjectApiGateways.rejected(new Error('canceled'), 'requestA', arg)
    )
    expect(state.projectApiGatewaysLoading).toBe(true)
    expect(state.projectApiGateways).toEqual([])

    state = nuclioReducer(
      state,
      fetchProjectApiGateways.fulfilled([{ name: 'gw' }], 'requestB', arg)
    )
    expect(state.projectApiGatewaysLoading).toBe(false)
    expect(state.projectApiGateways).toEqual([{ name: 'gw' }])
  })

  it('does not corrupt tracking when a stale response arrives after clearProjectApiGateways', () => {
    let state = nuclioReducer(undefined, { type: '@@INIT' })

    state = nuclioReducer(state, fetchProjectApiGateways.pending('requestA', arg))
    state = nuclioReducer(state, clearProjectApiGateways())
    expect(state.projectApiGateways).toEqual([])

    state = nuclioReducer(
      state,
      fetchProjectApiGateways.fulfilled([{ name: 'stale' }], 'requestA', arg)
    )
    expect(state.projectApiGateways).toEqual([])
    expect(state.projectApiGatewaysLoading).toBe(false)
  })
})
