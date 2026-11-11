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
import workflowReducer, { deleteWorkflows, fetchWorkflows } from './workflowReducer'

const arg = { project: 'p', filter: {}, config: {} }

describe('workflowReducer fetchWorkflows', () => {
  it('keeps loading true across an abort until the request that superseded it settles', () => {
    let state = workflowReducer(undefined, { type: '@@INIT' })

    state = workflowReducer(state, fetchWorkflows.pending('requestA', arg))
    expect(state.workflows.loading).toBe(true)

    state = workflowReducer(state, fetchWorkflows.pending('requestB', arg))
    expect(state.workflows.loading).toBe(true)

    state = workflowReducer(
      state,
      fetchWorkflows.rejected(new Error('canceled'), 'requestA', arg, 'canceled')
    )
    expect(state.workflows.loading).toBe(true)

    state = workflowReducer(state, fetchWorkflows.fulfilled([{ id: '1' }], 'requestB', arg))
    expect(state.workflows.loading).toBe(false)
    expect(state.workflows.data).toEqual([{ id: '1' }])
  })

  it('does not restore stale data or leave rerunInProgress intact after deleteWorkflows resets the slice', () => {
    let state = workflowReducer(undefined, { type: '@@INIT' })

    state = workflowReducer(state, fetchWorkflows.pending('requestA', arg))
    state = workflowReducer(state, deleteWorkflows())
    expect(state.workflows.data).toEqual([])
    expect(state.workflows.loading).toBe(false)

    state = workflowReducer(state, fetchWorkflows.fulfilled([{ id: 'stale' }], 'requestA', arg))
    expect(state.workflows.data).toEqual([])
    expect(state.workflows.loading).toBe(false)
  })
})
