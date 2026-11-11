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
import functionReducer, { fetchFunctions } from './functionReducer'

const arg = { project: 'p', filters: {}, config: {} }

describe('functionReducer fetchFunctions (multi-caller, data NOT guarded)', () => {
  it('resolves loading only once every outstanding request has settled', () => {
    let state = functionReducer(undefined, { type: '@@INIT' })

    state = functionReducer(state, fetchFunctions.pending('pageRequest', arg))
    state = functionReducer(state, fetchFunctions.pending('wizardRequest', arg))
    expect(state.loading).toBe(true)

    state = functionReducer(
      state,
      fetchFunctions.fulfilled({ funcs: [{ metadata: { name: 'f1' } }] }, 'pageRequest', arg)
    )
    expect(state.functions).toEqual([{ metadata: { name: 'f1' } }])
    expect(state.loading).toBe(true)

    state = functionReducer(
      state,
      fetchFunctions.fulfilled({ funcs: [{ metadata: { name: 'f2' } }] }, 'wizardRequest', arg)
    )
    expect(state.loading).toBe(false)
  })
})
