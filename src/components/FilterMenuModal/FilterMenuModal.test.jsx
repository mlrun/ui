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
/* eslint-disable react/display-name, react/prop-types */
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useField } from 'react-final-form'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FilterMenuModal from './FilterMenuModal'

const { dispatchMock } = vi.hoisted(() => ({
  dispatchMock: vi.fn()
}))

vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock
}))

vi.mock('../Details/details.util', () => ({
  performDetailsActionHelper: vi.fn(() => Promise.resolve(true))
}))

vi.mock('igz-controls/components', () => ({
  Button: ({ disabled, label, onClick }) => (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
  PopUpDialog: React.forwardRef(({ children, className }, ref) => (
    <div className={className} ref={ref}>
      {children}
    </div>
  )),
  RoundedIcon: React.forwardRef(({ children, className, isActive, onClick, tooltipText }, ref) => (
    <button
      className={className}
      data-active={isActive}
      data-testid="filter-trigger"
      onClick={onClick}
      ref={ref}
      title={tooltipText}
    >
      {children}
    </button>
  ))
}))

const TestField = ({ validate }) => {
  const { input } = useField('labels', { validate })

  return <input aria-label="Labels" {...input} />
}

const defaultValues = { labels: '' }
const appliedValues = { labels: 'team=test' }

const renderModal = ({
  applyChanges = vi.fn(),
  initialValues = defaultValues,
  values = appliedValues,
  validate
} = {}) => {
  const result = render(
    <React.StrictMode>
      <FilterMenuModal applyChanges={applyChanges} initialValues={initialValues} values={values}>
        <TestField validate={validate} />
      </FilterMenuModal>
    </React.StrictMode>
  )

  return { ...result, applyChanges }
}

describe('FilterMenuModal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('mounts conditional fields from the applied values', () => {
    renderModal()

    const trigger = screen.getByTestId('filter-trigger')

    expect(trigger).toHaveClass('filters-button_applied')
    expect(trigger).toHaveAttribute('title', 'Filter (1)')

    fireEvent.click(trigger)

    expect(screen.getByLabelText('Labels')).toHaveValue('team=test')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeEnabled()
  })

  it('preserves an unapplied draft when fields unmount and remount', () => {
    renderModal()

    const trigger = screen.getByTestId('filter-trigger')

    fireEvent.click(trigger)
    fireEvent.change(screen.getByLabelText('Labels'), { target: { value: 'draft' } })
    fireEvent.click(trigger)
    fireEvent.click(trigger)

    expect(screen.getByLabelText('Labels')).toHaveValue('draft')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled()
  })

  it('reinitializes the form when applied values change externally', async () => {
    const { rerender } = renderModal()

    fireEvent.click(screen.getByTestId('filter-trigger'))

    rerender(
      <React.StrictMode>
        <FilterMenuModal
          applyChanges={vi.fn()}
          initialValues={defaultValues}
          values={{ labels: 'team=updated' }}
        >
          <TestField />
        </FilterMenuModal>
      </React.StrictMode>
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Labels')).toHaveValue('team=updated')
    })
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('clears applied values even when the current draft is invalid', async () => {
    const validate = value => (value === 'invalid' ? 'Invalid label' : undefined)
    const { applyChanges } = renderModal({ validate })

    fireEvent.click(screen.getByTestId('filter-trigger'))
    fireEvent.change(screen.getByLabelText('Labels'), { target: { value: 'invalid' } })

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    await waitFor(() => {
      expect(applyChanges).toHaveBeenCalledWith(defaultValues, true)
    })
  })
})
