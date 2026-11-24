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
import React, { useState } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import FeatureSetsPanelTargetStore from './FeatureSetsPanelTargetStore'

import appStore from '../../../reducers/appReducer'
import featureStore from '../../../reducers/featureStoreReducer'

const PROJECT = 'test-project'
const FILE_PATH = `s3://test-artifacts/${PROJECT}/FeatureStore/test-set/parquet/updated_targets/test-set.parquet`
const DIRECTORY_PATH = `s3://test-artifacts/${PROJECT}/FeatureStore/test-set/parquet/updated_targets/v1.${'a'.repeat(70)}/dir`

const setNativeInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set

const TargetStoreWrapper = () => {
  const [validation, setValidation] = useState({
    isOnlineTargetPathValid: true,
    isOfflineTargetPathValid: true,
    isExternalOfflineTargetPathValid: true,
    isOfflinePartitionBucketsValid: true,
    isOfflinePartitionColumnsValid: true,
    isExternalOfflinePartitionBucketsValid: true,
    isExternalOfflinePartitionColumnsValid: true,
    isTargetStoreValid: true
  })
  const [disableButtons, setDisableButtons] = useState({
    isExternalOfflineTargetPathEditModeClosed: true,
    isOnlineTargetPathEditModeClosed: true,
    isOfflineTargetPathEditModeClosed: true
  })

  return (
    <FeatureSetsPanelTargetStore
      disableButtons={disableButtons}
      project={PROJECT}
      setDisableButtons={setDisableButtons}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

describe('FeatureSetsPanelTargetStore offline target path', () => {
  let container
  let overlayContainer
  let store
  let errors

  const handleWindowError = event => {
    event.preventDefault()
    errors.push(event.error)
  }

  const getPathWrapper = () =>
    container.querySelector('.offline-path').closest('.target-store__path-wrapper')
  const getPathInput = () => getPathWrapper().querySelector('.offline-path input')
  const getPartitionCheckbox = () => getPathWrapper().querySelector('.checkbox')
  const getEditOrApplyButton = () =>
    getPathWrapper().querySelector('.target-store__path-actions button')
  const getOfflineTargetPath = () =>
    store
      .getState()
      .featureStore.newFeatureSet.spec.targets.find(target => target.name === 'parquet').path
  const isInputInvalid = () => getPathInput().classList.contains('input_invalid')
  const isApplyDisabled = () => getEditOrApplyButton().disabled

  const enterEditMode = () => {
    fireEvent.click(getEditOrApplyButton())
  }

  const enterPath = path => {
    fireEvent.change(getPathInput(), { target: { value: path } })
  }

  const enterPathAtMachineSpeed = async path => {
    const input = getPathInput()

    globalThis.IS_REACT_ACT_ENVIRONMENT = false
    input.focus()
    setNativeInputValue.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))

    for (const char of path) {
      setNativeInputValue.call(input, input.value + char)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }

    await new Promise(resolve => setTimeout(resolve))
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  }

  beforeEach(() => {
    errors = []
    window.addEventListener('error', handleWindowError)

    overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay_container'
    document.body.appendChild(overlayContainer)

    store = configureStore({
      reducer: { appStore, featureStore },
      preloadedState: {
        appStore: {
          ...appStore(undefined, { type: '@@init' }),
          frontendSpec: {
            feature_store_data_prefixes: {
              default: 'v3io:///projects/{project}/FeatureStore/{name}/{kind}'
            }
          }
        }
      }
    })
    ;({ container } = render(
      <Provider store={store}>
        <TargetStoreWrapper />
      </Provider>
    ))
  })

  afterEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    window.removeEventListener('error', handleWindowError)
    overlayContainer.remove()
  })

  describe('file path', () => {
    beforeEach(() => {
      enterEditMode()
    })

    it('keeps every character of the path entered at machine speed', async () => {
      await enterPathAtMachineSpeed(FILE_PATH)

      expect(errors).toEqual([])
      expect(getPathInput().value).toBe(FILE_PATH)

      fireEvent.click(getEditOrApplyButton())

      expect(getOfflineTargetPath()).toBe(FILE_PATH)
    })

    it('requires the .parquet/.pq suffix', () => {
      enterPath('s3://test-artifacts/test-set/parquet')

      expect(isInputInvalid()).toBe(true)
      expect(isApplyDisabled()).toBe(true)
      expect(container.querySelector('.input__warning')).not.toBeNull()

      enterPath('s3://test-artifacts/test-set/parquet.parquet')

      expect(isInputInvalid()).toBe(false)
      expect(isApplyDisabled()).toBe(false)

      enterPath('s3://test-artifacts/test-set/parquet.pq ')

      expect(isInputInvalid()).toBe(false)
      expect(isApplyDisabled()).toBe(false)

      enterPath('')

      expect(isInputInvalid()).toBe(true)
      expect(isApplyDisabled()).toBe(true)
    })

    it('does not allow switching to a partitioned path while editing', () => {
      expect(getPartitionCheckbox().classList.contains('checkbox_disabled')).toBe(true)

      enterPath('s3://test-artifacts/test-set/dir')
      fireEvent.click(getPartitionCheckbox())

      expect(isInputInvalid()).toBe(true)
      expect(getPathInput().value).toBe('s3://test-artifacts/test-set/dir')
    })
  })

  describe('partitioned path', () => {
    beforeEach(() => {
      fireEvent.click(getPartitionCheckbox())
      enterEditMode()
    })

    it('keeps every character of the path entered at machine speed', async () => {
      await enterPathAtMachineSpeed(DIRECTORY_PATH)

      expect(errors).toEqual([])
      expect(getPathInput().value).toBe(DIRECTORY_PATH)

      fireEvent.click(getEditOrApplyButton())

      expect(getOfflineTargetPath()).toBe(DIRECTORY_PATH)
    })

    it('requires a directory path', () => {
      enterPath('s3://test-artifacts/test-set/dir.parquet')

      expect(isInputInvalid()).toBe(true)
      expect(isApplyDisabled()).toBe(true)
      expect(container.querySelector('.input__warning')).not.toBeNull()

      enterPath('s3://test-artifacts/test-set/dir')

      expect(isInputInvalid()).toBe(false)
      expect(isApplyDisabled()).toBe(false)
    })
  })
})
