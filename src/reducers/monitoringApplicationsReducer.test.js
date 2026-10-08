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
import monitoringApplicationsReducer, {
  fetchMEPWithDetections,
  fetchMonitoringApplication,
  fetchMonitoringApplications,
  fetchMonitoringApplicationsSummary
} from './monitoringApplicationsReducer'

const arg = { project: 'p', filters: {}, signal: undefined }

describe('monitoringApplicationsReducer fetchMEPWithDetections (single caller, data guarded)', () => {
  it('keeps loading true across an abort and ignores the stale response', () => {
    let state = monitoringApplicationsReducer(undefined, { type: '@@INIT' })

    state = monitoringApplicationsReducer(state, fetchMEPWithDetections.pending('requestA', arg))
    state = monitoringApplicationsReducer(state, fetchMEPWithDetections.pending('requestB', arg))
    expect(state.endpointsWithDetections.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMEPWithDetections.rejected(new Error('canceled'), 'requestA', arg)
    )
    expect(state.endpointsWithDetections.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMEPWithDetections.fulfilled({ values: [1] }, 'requestB', arg)
    )
    expect(state.endpointsWithDetections.loading).toBe(false)
    expect(state.endpointsWithDetections.data).toEqual({ values: [1] })
  })
})

describe('monitoringApplicationsReducer fetchMonitoringApplication (multi-caller, data NOT guarded)', () => {
  it('applies both concurrent callers responses instead of dropping one as "stale"', () => {
    let state = monitoringApplicationsReducer(undefined, { type: '@@INIT' })

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplication.pending('pageRequest', arg)
    )
    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplication.pending('metricsRequest', arg)
    )
    expect(state.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplication.fulfilled({ name: 'app-from-page' }, 'pageRequest', arg)
    )
    expect(state.monitoringApplication).toEqual({ name: 'app-from-page' })
    expect(state.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplication.fulfilled({ name: 'app-from-metrics' }, 'metricsRequest', arg)
    )
    expect(state.loading).toBe(false)
  })
})

describe('monitoringApplicationsReducer fetchMonitoringApplicationsSummary', () => {
  it('keeps its own tracking fields intact when the payload replaces the whole slice', () => {
    let state = monitoringApplicationsReducer(undefined, { type: '@@INIT' })

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplicationsSummary.pending('requestA', arg)
    )
    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplicationsSummary.pending('requestB', arg)
    )
    expect(state.applicationsSummary.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplicationsSummary.rejected(new Error('canceled'), 'requestA', arg)
    )
    expect(state.applicationsSummary.loading).toBe(true)

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplicationsSummary.fulfilled({ total: 5 }, 'requestB', arg)
    )
    expect(state.applicationsSummary.loading).toBe(false)
    expect(state.applicationsSummary.total).toBe(5)
  })
})

describe('monitoringApplicationsReducer fetchMonitoringApplications', () => {
  it('resolves loading without getting stuck', () => {
    let state = monitoringApplicationsReducer(undefined, { type: '@@INIT' })

    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplications.pending('requestA', arg)
    )
    state = monitoringApplicationsReducer(
      state,
      fetchMonitoringApplications.fulfilled({ applications: [] }, 'requestA', arg)
    )
    expect(state.loading).toBe(false)
  })
})
