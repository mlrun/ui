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
import { enrichFunctionsWithNuclio, computeCounters } from '../utils/nuclioEnrichment.util'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('../utils/getNuclioFuncState', () => ({
  getNuclioFuncState: vi.fn(nuclioFunc => nuclioFunc?.status?.state ?? '')
}))

vi.mock('../utils/getState', () => ({
  default: vi.fn(state => ({
    value: state,
    label: state.charAt(0).toUpperCase() + state.slice(1),
    className: `state-${state}-nuclioFunctions`
  }))
}))

vi.mock('../utils/parseFunction', () => ({
  parseFunction: vi.fn()
}))

vi.mock('../reducers/functionReducer', () => ({
  fetchFunctions: vi.fn(),
  fetchFunction: vi.fn()
}))

vi.mock('../reducers/nuclioReducer', () => ({
  fetchNuclioFunction: vi.fn(),
  fetchNuclioFunctions: vi.fn()
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeFunc = (name, project = 'proj', stateValue = '', nuclioName = '') => ({
  name,
  project,
  nuclio_name: nuclioName,
  state: stateValue ? { value: stateValue } : undefined
})

const makeNuclioFunc = (state, owner = '') => ({
  status: { state },
  metadata: {
    labels: owner ? { 'iguazio.com/username': owner } : {}
  }
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useNuclioEnrichedFunctions pure helpers', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── enrichFunctionsWithNuclio ───────────────────────────────────────────────

  describe('enrichFunctionsWithNuclio', () => {
    it('enriches function with Nuclio state when Nuclio data is available', () => {
      const funcs = [makeFunc('my-func', 'proj')]
      const nuclioMap = { 'proj-my-func': makeNuclioFunc('ready', 'alice') }

      const [enriched] = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(enriched.state.value).toBe('ready')
      expect(enriched.owner).toBe('alice')
      expect(enriched.nuclioFunc).toEqual(nuclioMap['proj-my-func'])
    })

    it('falls back to MLRun state when Nuclio data is absent', () => {
      const funcs = [makeFunc('my-func', 'proj', 'building')]
      const nuclioMap = {}

      const [enriched] = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(enriched.state.value).toBe('building')
      expect(enriched.owner).toBe('')
      expect(enriched.nuclioFunc).toEqual({})
    })

    it('uses nuclio_name when available for the lookup key', () => {
      const funcs = [makeFunc('my-func', 'proj', '', 'custom-nuclio-name')]
      const nuclioMap = { 'custom-nuclio-name': makeNuclioFunc('running', 'bob') }

      const [enriched] = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(enriched.state.value).toBe('running')
      expect(enriched.owner).toBe('bob')
    })

    it('derives key from project-name when nuclio_name is empty', () => {
      const funcs = [makeFunc('svc', 'my-project')]
      const nuclioMap = { 'my-project-svc': makeNuclioFunc('error') }

      const [enriched] = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(enriched.state.value).toBe('error')
    })

    it('sets owner to empty string when Nuclio has no username label', () => {
      const funcs = [makeFunc('f', 'proj')]
      const nuclioMap = { 'proj-f': { status: { state: 'ready' }, metadata: { labels: {} } } }

      const [enriched] = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(enriched.owner).toBe('')
    })

    it('handles empty functions array', () => {
      expect(enrichFunctionsWithNuclio([], {})).toEqual([])
    })

    it('enriches multiple functions independently', () => {
      const funcs = [makeFunc('a', 'proj'), makeFunc('b', 'proj')]
      const nuclioMap = {
        'proj-a': makeNuclioFunc('ready', 'alice'),
        'proj-b': makeNuclioFunc('error', 'bob')
      }

      const result = enrichFunctionsWithNuclio(funcs, nuclioMap)

      expect(result).toHaveLength(2)
      expect(result[0].owner).toBe('alice')
      expect(result[1].owner).toBe('bob')
      expect(result[0].state.value).toBe('ready')
      expect(result[1].state.value).toBe('error')
    })
  })

  // ── computeCounters ─────────────────────────────────────────────────────────

  describe('computeCounters', () => {
    it('counts running for "ready" state', () => {
      const funcs = [{ state: { value: 'ready' } }]
      expect(computeCounters(funcs).running).toBe(1)
    })

    it('counts running for "running" state', () => {
      const funcs = [{ state: { value: 'running' } }]
      expect(computeCounters(funcs).running).toBe(1)
    })

    it('counts failed for "error" state', () => {
      const funcs = [{ state: { value: 'error' } }]
      expect(computeCounters(funcs).failed).toBe(1)
    })

    it('counts failed for "unhealthy" state', () => {
      const funcs = [{ state: { value: 'unhealthy' } }]
      expect(computeCounters(funcs).failed).toBe(1)
    })

    it('counts building for "building" state', () => {
      const funcs = [{ state: { value: 'building' } }]
      expect(computeCounters(funcs).building).toBe(1)
    })

    it('ignores unknown states in all specific counters', () => {
      const funcs = [{ state: { value: 'unknown-state' } }]
      const counters = computeCounters(funcs)
      expect(counters.total).toBe(1)
      expect(counters.running).toBe(0)
      expect(counters.failed).toBe(0)
      expect(counters.building).toBe(0)
    })

    it('returns zero counters for empty array', () => {
      expect(computeCounters([])).toEqual({ total: 0, running: 0, failed: 0, building: 0 })
    })

    it('correctly aggregates mixed states', () => {
      const funcs = [
        { state: { value: 'ready' } },
        { state: { value: 'running' } },
        { state: { value: 'error' } },
        { state: { value: 'unhealthy' } },
        { state: { value: 'building' } },
        { state: { value: 'creating' } }
      ]
      const counters = computeCounters(funcs)
      expect(counters.total).toBe(6)
      expect(counters.running).toBe(2)
      expect(counters.failed).toBe(2)
      expect(counters.building).toBe(1)
    })

    it('handles functions with missing state gracefully', () => {
      const funcs = [{ state: undefined }, { state: null }, {}]
      const counters = computeCounters(funcs)
      expect(counters.total).toBe(3)
      expect(counters.running).toBe(0)
      expect(counters.failed).toBe(0)
      expect(counters.building).toBe(0)
    })
  })
})
