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
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'react-final-form'
import { Provider } from 'react-redux'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import TargetPath from './TargetPath'
import { targetPathInitialState } from './targetPath.util'

vi.mock('../../reducers/projectReducer', async importOriginal => ({
  ...(await importOriginal()),
  fetchProjectsNames: () => ({ type: 'projectsNames' })
}))
vi.mock('../../reducers/artifactsReducer', async importOriginal => ({
  ...(await importOriginal()),
  fetchArtifacts: () => ({ type: 'artifacts' }),
  fetchArtifact: () => ({ type: 'artifact' })
}))

const responses = {
  projectsNames: ['other-project', 'test-project'],
  artifacts: [{ db_key: 'iris' }, { db_key: 'wine' }],
  artifact: [
    {
      data: [
        { iter: 0, tag: 'latest' },
        { iter: 0, tag: 'v1' }
      ]
    }
  ]
}

const store = {
  dispatch: action => ({ unwrap: () => Promise.resolve(responses[action?.type] ?? []) }),
  getState: () => ({}),
  subscribe: () => () => {}
}

const setNativeInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set

const required = { name: 'required', label: 'This field is required' }

// the suggestions are fetched with a 300ms debounce
const waitForSuggestions = () => act(() => new Promise(resolve => setTimeout(resolve, 400)))

const renderTargetPath = ({
  initialData = { path: '', fieldInfo: { pathType: '', value: '' } },
  withDataInputState = true,
  ...props
} = {}) => {
  let form

  const { container } = render(
    <Provider store={store}>
      <Form initialValues={{ data: initialData }} onSubmit={() => {}}>
        {formState => {
          form = formState.form

          return (
            <TargetPath
              formState={formState}
              formStateDataInputState={withDataInputState ? 'data.dataInputState' : ''}
              formStateFieldInfo="data.fieldInfo"
              name="data.path"
              params={{ projectName: 'test-project' }}
              required
              setFieldState={() => {}}
              {...props}
            />
          )
        }}
      </Form>
    </Provider>
  )
  const input = container.querySelector('.form-field-combobox__input')
  const getSuggestions = () =>
    [
      ...document.querySelectorAll(
        '.form-field-combobox__dropdown-suggestions .form-field-combobox__dropdown-list-option'
      )
    ].map(option => option.textContent)

  return {
    focusInput: async () => {
      input.blur()
      fireEvent.focus(input)
      // the combobox shows the suggestions in a timeout after the focus
      await act(() => new Promise(resolve => setTimeout(resolve)))
    },
    getData: () => form.getState().values.data,
    getError: () => form.getFieldState('data.path').error,
    getSuggestions,
    form,
    input,
    selectScheme: label => {
      fireEvent.click(container.querySelector('.form-field-combobox__select-header'))
      fireEvent.click(screen.getAllByText(label).at(-1))
    },
    type: text => {
      for (const char of text) {
        fireEvent.change(input, { target: { value: input.value + char } })
      }
    },
    clickSuggestion: label => {
      // in the browser the click on the option takes the focus from the input
      input.blur()
      fireEvent.click(
        [
          ...document.querySelectorAll(
            '.form-field-combobox__dropdown-suggestions .form-field-combobox__dropdown-list-option'
          )
        ].find(option => option.textContent === label)
      )
    }
  }
}

describe('TargetPath', () => {
  beforeAll(() => {
    const overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay_container'
    document.body.appendChild(overlayContainer)
  })

  it('sets the path type and shows the required error after a scheme is selected', () => {
    const { getData, getError, selectScheme } = renderTargetPath()

    for (const [label, pathType] of [
      ['HTTPS', 'https://'],
      ['S3', 's3://'],
      ['MLRun store', 'store://']
    ]) {
      selectScheme(label)

      expect(getData()).toMatchObject({ path: pathType, fieldInfo: { pathType, value: '' } })
      expect(getError()).toEqual(required)
    }
  })

  it('updates the path and the field info while typing', () => {
    const { getData, getError, input, selectScheme, type } = renderTargetPath()

    selectScheme('HTTPS')
    type('host.example.com/data.csv')

    expect(input.value).toBe('host.example.com/data.csv')
    expect(getData()).toMatchObject({
      path: 'https://host.example.com/data.csv',
      fieldInfo: { pathType: 'https://', value: 'host.example.com/data.csv' }
    })
    expect(getError()).toBeUndefined()
  })

  it('validates the typed path against the selected scheme', () => {
    const { getError, selectScheme, type } = renderTargetPath()

    selectScheme('S3')
    type('bucket')

    expect(getError()).toBe('This field is invalid')

    type('/key.csv')

    expect(getError()).toBeUndefined()
  })

  it('keeps the scheme and shows the required error when the input is cleared', () => {
    const { getData, getError, input, selectScheme, type } = renderTargetPath()

    selectScheme('HTTPS')
    type('host/a')
    fireEvent.change(input, { target: { value: '' } })

    expect(getData()).toMatchObject({
      path: 'https://',
      fieldInfo: { pathType: 'https://', value: '' }
    })
    expect(getError()).toEqual(required)
  })

  it('builds an MLRun store path from the suggestions', async () => {
    const { clickSuggestion, focusInput, getData, getError, getSuggestions, input, selectScheme } =
      renderTargetPath()

    selectScheme('MLRun store')
    await focusInput()

    expect(getSuggestions()).toEqual([
      'Artifacts',
      'Datasets',
      'Documents',
      'Models',
      'Feature vectors'
    ])

    clickSuggestion('Datasets')
    await waitForSuggestions()

    expect(getSuggestions()).toEqual(['test-project (Current project)', 'other-project'])

    clickSuggestion('test-project (Current project)')
    await waitForSuggestions()

    expect(getSuggestions()).toEqual(['iris', 'wine'])

    clickSuggestion('iris')
    await waitForSuggestions()

    expect(getSuggestions()).toEqual(['#0:latest', '#0:v1'])

    clickSuggestion('#0:v1')

    expect(input.value).toBe('datasets/test-project/iris#0:v1')
    expect(getData()).toMatchObject({
      path: 'store://datasets/test-project/iris#0:v1',
      fieldInfo: { pathType: 'store://', value: 'datasets/test-project/iris#0:v1' },
      dataInputState: {
        inputProjectItemPathEntered: true,
        inputProjectItemReferencePathEntered: true,
        inputProjectPathEntered: true,
        inputStorePathTypeEntered: true,
        project: 'test-project',
        projectItem: 'iris',
        projectItemReference: '#0:v1',
        storePathType: 'datasets'
      }
    })
    expect(getError()).toBeUndefined()
  })

  it('keeps the MLRun store state of a typed path in the form', async () => {
    const { getData, selectScheme, type } = renderTargetPath()

    selectScheme('MLRun store')
    type('datasets/')
    await waitForSuggestions()
    type('test-project/')
    await waitForSuggestions()
    type('iris:latest')

    expect(getData()).toMatchObject({
      fieldInfo: { pathType: 'store://', value: 'datasets/test-project/iris:latest' },
      dataInputState: {
        artifacts: [
          { id: 'iris', label: 'iris' },
          { id: 'wine', label: 'wine' }
        ],
        inputProjectItemPathEntered: true,
        inputProjectPathEntered: true,
        inputStorePathTypeEntered: true,
        project: 'test-project',
        projectItem: 'iris',
        projectItemReference: ':latest',
        storePathType: 'datasets'
      }
    })
  })

  it('resets the MLRun store suggestions after switching to another scheme', async () => {
    const { focusInput, getData, getSuggestions, selectScheme, type } = renderTargetPath()

    selectScheme('MLRun store')
    type('datasets/')
    await waitForSuggestions()
    selectScheme('HTTPS')

    expect(getData()).toMatchObject({
      path: 'https://',
      fieldInfo: { pathType: 'https://', value: '' }
    })

    selectScheme('MLRun store')
    await focusInput()

    expect(getSuggestions()).toEqual([
      'Artifacts',
      'Datasets',
      'Documents',
      'Models',
      'Feature vectors'
    ])
  })

  it('updates the field info when the path is changed by the form', () => {
    const { form, getData } = renderTargetPath()

    act(() => form.change('data.path', 's3://bucket/file.csv'))

    expect(getData()).toMatchObject({ fieldInfo: { pathType: 's3://', value: 'bucket/file.csv' } })
  })

  it('edits an existing path', () => {
    const path = 'datasets/test-project/iris:latest'
    const initialData = {
      path: `store://${path}`,
      fieldInfo: { pathType: 'store://', value: path }
    }
    const { getData, input } = renderTargetPath({
      initialData,
      inputDefaultValue: path,
      selectDefaultValue: 'store://'
    })

    expect(input.value).toBe(path)
    expect(getData()).toEqual(initialData)

    fireEvent.change(input, { target: { value: 'datasets/test-project/iris' } })

    expect(getData()).toMatchObject({
      path: 'store://datasets/test-project/iris',
      fieldInfo: { pathType: 'store://', value: 'datasets/test-project/iris' },
      dataInputState: { projectItem: 'iris', projectItemReference: '' }
    })
  })

  it('shows the suggestions of a restored MLRun store state', async () => {
    const path = 'datasets/test-project/'
    const { focusInput, getSuggestions } = renderTargetPath({
      initialData: { path: `store://${path}`, fieldInfo: { pathType: 'store://', value: path } },
      inputDefaultState: {
        ...targetPathInitialState,
        artifacts: [{ id: 'iris', label: 'iris' }],
        comboboxMatches: [{ id: 'outdated', label: 'outdated' }],
        inputProjectPathEntered: true,
        inputStorePathTypeEntered: true,
        project: 'test-project',
        projectItem: '',
        storePathType: 'datasets'
      },
      inputDefaultValue: path,
      selectDefaultValue: 'store://'
    })

    await focusInput()

    expect(getSuggestions()).toEqual(['iris'])
  })

  it('does not keep the MLRun store state in the form without formStateDataInputState', () => {
    const { getData, selectScheme, type } = renderTargetPath({ withDataInputState: false })

    selectScheme('MLRun store')
    type('datasets/')

    expect(getData()).toEqual({
      path: 'store://datasets/',
      fieldInfo: { pathType: 'store://', value: 'datasets/' }
    })
  })

  // ML-13196: Selenium `send_keys` lost the 53rd character of a data input path
  describe('with machine-speed input', () => {
    let errors
    const onError = event => {
      event.preventDefault()
      errors.push(event.error)
    }

    const typeAtMachineSpeed = async (input, text) => {
      // outside of act() React schedules its work as in the browser
      globalThis.IS_REACT_ACT_ENVIRONMENT = false
      input.focus()

      for (const char of text) {
        setNativeInputValue.call(input, input.value + char)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }

      await new Promise(resolve => setTimeout(resolve))
    }

    beforeEach(() => {
      errors = []
      window.addEventListener('error', onError)
    })

    afterEach(() => {
      window.removeEventListener('error', onError)
      globalThis.IS_REACT_ACT_ENVIRONMENT = true
    })

    it('keeps every character of an HTTPS path', async () => {
      const path = 'storage.example.com/test-bucket/datasets/machine-speed-input/train/data.csv'
      const { getData, input, selectScheme } = renderTargetPath()

      selectScheme('HTTPS')
      await typeAtMachineSpeed(input, path)

      expect(errors).toEqual([])
      expect(input.value).toBe(path)
      expect(getData()).toMatchObject({
        path: `https://${path}`,
        fieldInfo: { pathType: 'https://', value: path }
      })
    })

    it('keeps every character of an MLRun store path', async () => {
      const path = 'datasets/test-project/a-dataset-with-a-long-name-for-machine-speed-input:latest'
      const { getData, input, selectScheme } = renderTargetPath()

      selectScheme('MLRun store')
      await typeAtMachineSpeed(input, path)

      expect(errors).toEqual([])
      expect(input.value).toBe(path)
      expect(getData()).toMatchObject({
        path: `store://${path}`,
        fieldInfo: { pathType: 'store://', value: path },
        dataInputState: {
          storePathType: 'datasets',
          project: 'test-project',
          projectItem: 'a-dataset-with-a-long-name-for-machine-speed-input',
          projectItemReference: ':latest'
        }
      })
    })
  })
})
