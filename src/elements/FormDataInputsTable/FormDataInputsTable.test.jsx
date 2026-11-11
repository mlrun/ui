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
import arrayMutators from 'final-form-arrays'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import FormDataInputsTable from './FormDataInputsTable'
import { setFieldState } from 'igz-controls/utils/form.util'

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
  projectsNames: ['test-project'],
  artifacts: [{ db_key: 'iris' }, { db_key: 'wine' }],
  artifact: [{ data: [{ iter: 0, tag: 'latest' }] }]
}

const store = {
  dispatch: action => ({ unwrap: () => Promise.resolve(responses[action?.type] ?? []) }),
  getState: () => ({}),
  subscribe: () => () => {}
}

const setNativeInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set

const fieldsPath = 'dataInputs.dataInputsTable'

const wait = (ms = 0) => act(() => new Promise(resolve => setTimeout(resolve, ms)))

const renderTable = () => {
  let form

  const { container } = render(
    <Provider store={store}>
      <Form
        initialValues={{
          dataInputs: {
            dataInputsTable: [
              {
                data: {
                  name: 'dataset',
                  path: '',
                  fieldInfo: { pathType: '', value: '' },
                  isChecked: true
                },
                doc: '',
                isPredefined: true,
                isRequired: true
              }
            ]
          }
        }}
        mutators={{ ...arrayMutators, setFieldState }}
        onSubmit={() => {}}
      >
        {formState => {
          form = formState.form

          return (
            <FormDataInputsTable
              fieldsPath={fieldsPath}
              formState={formState}
              params={{ projectName: 'test-project' }}
            />
          )
        }}
      </Form>
    </Provider>
  )
  const getPathInput = () => container.querySelector('.form-field-combobox__input')

  return {
    apply: () => fireEvent.click(screen.getByTestId('apply-btn').querySelector('button')),
    editRow: async () => {
      fireEvent.click(container.querySelector('.form-table__row:not(.form-table__header-row)'))
      // useFormTable enters the edit mode in a timeout
      await wait()
    },
    focusPathInput: async () => {
      getPathInput().blur()
      fireEvent.focus(getPathInput())
      await wait()
    },
    getPathInput,
    getRowData: () => form.getState().values.dataInputs.dataInputsTable[0].data,
    getSuggestions: () =>
      [
        ...document.querySelectorAll(
          '.form-field-combobox__dropdown-suggestions .form-field-combobox__dropdown-list-option'
        )
      ].map(option => option.textContent),
    selectScheme: label => {
      fireEvent.click(container.querySelector('.form-field-combobox__select-header'))
      fireEvent.click(screen.getAllByText(label).at(-1))
    },
    type: text => {
      for (const char of text) {
        fireEvent.change(getPathInput(), { target: { value: getPathInput().value + char } })
      }
    }
  }
}

describe('FormDataInputsTable', () => {
  beforeAll(() => {
    const overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay_container'
    document.body.appendChild(overlayContainer)
  })

  afterEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  // ML-13196: Selenium `send_keys` lost the 53rd character of a data input path
  it('applies a data input path typed at machine speed', async () => {
    const path = 'storage.example.com/test-bucket/datasets/machine-speed-input/train/data.csv'
    const errors = []
    const onError = event => {
      event.preventDefault()
      errors.push(event.error)
    }
    const { apply, editRow, getPathInput, getRowData, selectScheme } = renderTable()

    await editRow()
    selectScheme('HTTPS')

    window.addEventListener('error', onError)
    // outside of act() React schedules its work as in the browser
    globalThis.IS_REACT_ACT_ENVIRONMENT = false
    getPathInput().focus()

    for (const char of path) {
      setNativeInputValue.call(getPathInput(), getPathInput().value + char)
      getPathInput().dispatchEvent(new Event('input', { bubbles: true }))
    }

    await new Promise(resolve => setTimeout(resolve))
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    window.removeEventListener('error', onError)

    apply()
    await wait()

    expect(errors).toEqual([])
    expect(getRowData()).toMatchObject({
      path: `https://${path}`,
      fieldInfo: { pathType: 'https://', value: path }
    })
    expect(screen.getByText(`https://${path}`)).toBeInTheDocument()
  })

  it('restores the MLRun store suggestions when an applied input is edited again', async () => {
    const {
      apply,
      editRow,
      focusPathInput,
      getPathInput,
      getRowData,
      getSuggestions,
      selectScheme,
      type
    } = renderTable()

    await editRow()
    selectScheme('MLRun store')
    type('datasets/')
    await wait(400)
    type('test-project/')
    await wait(400)
    type('iris')
    apply()
    await wait()

    expect(getRowData()).toMatchObject({
      path: 'store://datasets/test-project/iris',
      fieldInfo: { pathType: 'store://', value: 'datasets/test-project/iris' }
    })

    await editRow()

    expect(getPathInput().value).toBe('datasets/test-project/iris')

    fireEvent.change(getPathInput(), { target: { value: 'datasets/test-project/' } })
    await focusPathInput()

    expect(getSuggestions()).toEqual(['iris', 'wine'])
  })
})
