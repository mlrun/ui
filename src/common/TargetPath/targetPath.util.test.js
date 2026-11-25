/*
Copyright 2022 Iguazio Systems Ltd.
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
import { describe, expect, it, vi } from 'vitest'

import { handleStoreInputPathChange, targetPathInitialState } from './targetPath.util'

describe('handleStoreInputPathChange', () => {
  const artifacts = [{ id: 'iris', label: 'iris' }]
  const artifactsReferences = [{ id: ':latest', label: ':latest' }]
  const targetPathState = {
    ...targetPathInitialState,
    artifacts,
    artifactsReferences,
    projects: [{ id: 'test-project', label: 'test-project' }]
  }

  it('returns the state parsed from the path and merges it into the previous state', () => {
    const setTargetPathState = vi.fn()

    const storeInputPathState = handleStoreInputPathChange(
      targetPathState,
      setTargetPathState,
      'datasets/test-project/iris:latest'
    )

    expect(storeInputPathState).toEqual({
      artifacts,
      artifactsReferences,
      featureVectors: [],
      featureVectorsReferences: [],
      inputProjectItemPathEntered: true,
      inputProjectItemReferencePathEntered: true,
      inputProjectPathEntered: true,
      inputStorePathTypeEntered: true,
      project: 'test-project',
      projectItem: 'iris',
      projectItemReference: ':latest',
      storePathType: 'datasets'
    })

    const previousState = { ...targetPathState, comboboxMatches: [{ id: 'iris', label: 'iris' }] }

    expect(setTargetPathState.mock.calls[0][0](previousState)).toEqual({
      ...previousState,
      ...storeInputPathState
    })
  })

  it('clears the loaded items when the path goes back to the project', () => {
    const storeInputPathState = handleStoreInputPathChange(
      targetPathState,
      vi.fn(),
      'datasets/test-project'
    )

    expect(storeInputPathState).toMatchObject({
      artifacts: [],
      artifactsReferences: [],
      inputProjectItemPathEntered: false,
      inputProjectPathEntered: false,
      inputStorePathTypeEntered: true,
      project: 'test-project'
    })
  })
})
