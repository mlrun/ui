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
import jobReducer, { abortJob, fetchAllJobRuns, fetchJobs, fetchScheduledJobs } from './jobReducer'

const arg = { project: 'p', filters: {}, config: {} }

describe('jobReducer fetchJobs loading', () => {
  it('keeps loading true across an abort until the request that superseded it settles', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    // Request A starts (e.g. the initial page load)
    state = jobReducer(state, fetchJobs.pending('requestA', arg))
    expect(state.loading).toBe(true)

    // The user refreshes before A settles: request B starts
    state = jobReducer(state, fetchJobs.pending('requestB', arg))
    expect(state.loading).toBe(true)

    // A is aborted in favor of B
    state = jobReducer(
      state,
      fetchJobs.rejected(new Error('canceled'), 'requestA', arg, { aborted: true })
    )
    expect(state.loading).toBe(true)
    expect(state.jobs).toEqual([])
    expect(state.error).toBeNull()

    // B fulfills with real data
    state = jobReducer(state, fetchJobs.fulfilled([{ uid: '1' }], 'requestB', arg))
    expect(state.loading).toBe(false)
    expect(state.jobs).toEqual([{ uid: '1' }])
  })

  it('does not get stuck loading when an abort has no follow-up request (e.g. a large-response cancel)', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    state = jobReducer(state, fetchJobs.pending('requestA', arg))
    state = jobReducer(
      state,
      fetchJobs.rejected(new Error('Large request canceled'), 'requestA', arg, { aborted: true })
    )

    expect(state.loading).toBe(false)
  })

  it('clears jobs and sets an error, and resolves loading, on a real failure', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    state = jobReducer(state, fetchJobs.pending('requestA', arg))
    state = jobReducer(
      state,
      fetchJobs.rejected(new Error('Network Error'), 'requestA', arg, new Error('Network Error'))
    )

    expect(state.loading).toBe(false)
    expect(state.jobs).toEqual([])
    expect(state.error).toBeTruthy()
  })

  it('does not let a stale fetchJobs response overwrite jobs after the user switched to the Scheduled tab', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    state = jobReducer(state, fetchJobs.pending('jobsRequest', arg))

    state = jobReducer(state, fetchScheduledJobs.pending('scheduledRequest', arg))
    expect(state.loading).toBe(true)

    state = jobReducer(state, fetchJobs.fulfilled([{ uid: 'stale-job' }], 'jobsRequest', arg))

    expect(state.jobs).toEqual([])
    expect(state.loading).toBe(true)

    state = jobReducer(
      state,
      fetchScheduledJobs.fulfilled([{ name: 'sched-1' }], 'scheduledRequest', arg)
    )
    expect(state.loading).toBe(false)
    expect(state.scheduled).toEqual([{ name: 'sched-1' }])
  })

  it('keeps a shared currentRequestId across fetchJobs/fetchAllJobRuns/fetchScheduledJobs', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    state = jobReducer(state, fetchAllJobRuns.pending('runsRequest', arg))
    expect(state.loading).toBe(true)

    state = jobReducer(state, fetchAllJobRuns.fulfilled([{ uid: 'run-1' }], 'runsRequest', arg))
    expect(state.loading).toBe(false)
    expect(state.jobRuns).toEqual([{ uid: 'run-1' }])
  })

  it('does not let a quick mutation (e.g. Abort) clear loading while a list refresh is still in flight', () => {
    let state = jobReducer(undefined, { type: '@@INIT' })

    state = jobReducer(state, fetchJobs.pending('refreshRequest', arg))
    expect(state.loading).toBe(true)

    state = jobReducer(state, abortJob.pending('abortRequest', { projectName: 'p', job: {} }))
    expect(state.loading).toBe(true)

    state = jobReducer(state, abortJob.fulfilled({}, 'abortRequest', { projectName: 'p', job: {} }))
    expect(state.loading).toBe(true)

    state = jobReducer(state, fetchJobs.fulfilled([{ uid: 'job-1' }], 'refreshRequest', arg))
    expect(state.loading).toBe(false)
    expect(state.jobs).toEqual([{ uid: 'job-1' }])
  })
})
