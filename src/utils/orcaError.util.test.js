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

import { getOrcaErrorMessage } from './orcaError.util'

const mfMode = vi.hoisted(() => ({ enabled: true }))

vi.mock('../constants', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    get IS_MF_MODE() {
      return mfMode.enabled
    }
  }
})

const orcaError = errorMessage => ({
  response: { status: 412, data: { status: { errorMessage, statusCode: 412 } } }
})

describe('getOrcaErrorMessage', () => {
  beforeEach(() => {
    mfMode.enabled = true
  })

  it('returns the leader reason from status.errorMessage in MF mode', () => {
    expect(getOrcaErrorMessage(orcaError('project is being deleted'))).toBe(
      'project is being deleted'
    )
  })

  it('returns undefined outside MF mode', () => {
    mfMode.enabled = false

    expect(getOrcaErrorMessage(orcaError('project is being deleted'))).toBeUndefined()
  })

  it('returns undefined for an MLRun-shaped body', () => {
    expect(getOrcaErrorMessage({ response: { data: { detail: 'boom' } } })).toBeUndefined()
  })

  it('returns undefined for an empty or non-string message', () => {
    expect(getOrcaErrorMessage(orcaError(''))).toBeUndefined()
    expect(getOrcaErrorMessage(orcaError(42))).toBeUndefined()
  })

  it('returns undefined when there is no error or response', () => {
    expect(getOrcaErrorMessage(undefined)).toBeUndefined()
    expect(getOrcaErrorMessage(new Error('network'))).toBeUndefined()
  })
})
