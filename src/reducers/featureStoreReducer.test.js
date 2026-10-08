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
import featureStoreReducer, {
  fetchEntities,
  fetchFeatures,
  fetchFeatureSets,
  removeEntities,
  removeFeatures
} from './featureStoreReducer'

vi.mock('../utils/parseFeatureSets', () => ({
  parseFeatureSets: featureSets => featureSets
}))

const arg = { project: 'p', filters: {}, config: {} }

describe('featureStoreReducer fetchFeatureSets loading counter', () => {
  it('keeps loading true across an abort until the request that superseded it settles', () => {
    let state = featureStoreReducer(undefined, { type: '@@INIT' })

    state = featureStoreReducer(state, fetchFeatureSets.pending('requestA', arg))
    expect(state.loading).toBe(true)

    state = featureStoreReducer(state, fetchFeatureSets.pending('requestB', arg))
    expect(state.loading).toBe(true)

    state = featureStoreReducer(
      state,
      fetchFeatureSets.rejected(new Error('canceled'), 'requestA', arg, 'canceled')
    )
    expect(state.loading).toBe(true)

    state = featureStoreReducer(
      state,
      fetchFeatureSets.fulfilled([{ metadata: { name: 'fs1', tag: 'latest' } }], 'requestB', arg)
    )
    expect(state.loading).toBe(false)
    expect(state.featureSets.allData).toHaveLength(1)
  })
})

describe('removeEntities / removeFeatures reset', () => {
  it('does not restore stale entities data when a request settles after removeEntities', () => {
    let state = featureStoreReducer(undefined, { type: '@@INIT' })

    state = featureStoreReducer(state, fetchEntities.pending('requestA', arg))
    expect(state.entities.loading).toBe(true)

    state = featureStoreReducer(state, removeEntities())
    expect(state.entities.pendingRequestIds).toEqual([])
    expect(state.entities.allData).toEqual([])

    state = featureStoreReducer(state, fetchEntities.fulfilled([{ id: 'stale' }], 'requestA', arg))
    expect(state.entities.pendingRequestIds.length).not.toBeNaN()
    expect(state.entities.loading).toBe(false)
    expect(state.entities.allData).toEqual([])
  })

  it('does not get stuck loading when a request settles after removeFeatures', () => {
    let state = featureStoreReducer(undefined, { type: '@@INIT' })

    state = featureStoreReducer(state, fetchFeatures.pending('requestA', arg))
    expect(state.features.loading).toBe(true)

    state = featureStoreReducer(state, removeFeatures())
    expect(state.features.pendingRequestIds).toEqual([])

    state = featureStoreReducer(
      state,
      fetchFeatures.rejected(new Error('canceled'), 'requestA', arg)
    )
    expect(state.features.pendingRequestIds.length).not.toBeNaN()
    expect(state.features.loading).toBe(false)
  })
})
