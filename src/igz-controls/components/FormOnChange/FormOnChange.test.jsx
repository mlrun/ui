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
import { fireEvent, render, screen } from '@testing-library/react'
import { Field, Form } from 'react-final-form'
import { describe, expect, it, vi } from 'vitest'

import FormOnChange from './FormOnChange'

const renderForm = ({ getHandler, initialValues = { source: '' }, children = null }) => {
  let form

  render(
    <Form initialValues={initialValues} onSubmit={() => {}}>
      {formState => {
        form = formState.form

        return (
          <>
            <Field name="source" component="input" data-testid="source" />
            {children?.(formState)}
            <FormOnChange handler={getHandler(formState.form)} name="source" />
          </>
        )
      }}
    </Form>
  )

  return {
    form,
    input: screen.getByTestId('source')
  }
}

describe('FormOnChange', () => {
  it('does not call the handler on mount', () => {
    const handler = vi.fn()

    renderForm({ getHandler: () => handler, initialValues: { source: 'initial' } })

    expect(handler).not.toHaveBeenCalled()
  })

  it('calls the handler once per change with the new and the previous value', () => {
    const handler = vi.fn()
    const { input } = renderForm({ getHandler: () => handler })

    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'ab' } })
    fireEvent.change(input, { target: { value: '' } })

    expect(handler.mock.calls).toEqual([
      ['a', ''],
      ['ab', 'a'],
      ['', 'ab']
    ])
  })

  it('applies the form changes made by the handler', () => {
    const { form, input } = renderForm({
      getHandler: form => value => form.change('derived', value?.toUpperCase())
    })

    fireEvent.change(input, { target: { value: 'abc' } })

    expect(form.getState().values).toEqual({ source: 'abc', derived: 'ABC' })
  })

  it('does not loop when the handler writes the same value back to the watched field', () => {
    const handler = vi.fn()
    const { form, input } = renderForm({
      getHandler: form => value => {
        handler(value)
        form.change('source', value)
      }
    })

    fireEvent.change(input, { target: { value: 'abc' } })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(form.getState().values).toEqual({ source: 'abc' })
  })

  // react-final-form refreshes the field validators in passive effects, so the handler must not run
  // before them (e.g. from a layout effect): FormResourcesUnits converts the CPU value when the unit
  // changes and the converted value must be validated with the minimum of the new unit
  it('validates the form changes made by the handler with the validators of the same render', () => {
    const { form, input } = renderForm({
      initialValues: { source: 'cpu', amount: '0.5' },
      getHandler: form => unit => form.change('amount', unit === 'millicpu' ? '500' : '0.5'),
      children: formState => (
        <Field
          name="amount"
          component="input"
          validate={value =>
            +value < (formState.values.source === 'millicpu' ? 1 : 0.001) ? 'Too small' : undefined
          }
        />
      )
    })

    fireEvent.change(input, { target: { value: 'millicpu' } })
    fireEvent.change(input, { target: { value: 'cpu' } })

    expect(form.getState().values.amount).toBe('0.5')
    expect(form.getFieldState('amount').error).toBeUndefined()
  })
})
