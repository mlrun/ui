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
import { useState } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Combobox from './Combobox'
import { DATASETS_PAGE, MODELS_PAGE } from '../../constants'

const MockIcon = ({ onClick, className, 'data-testid': testId }) => (
  <div onClick={onClick} className={className} data-testid={testId || 'mock-icon'} />
)

vi.mock('igz-controls/images/arrow.svg?react', () => ({
  default: props => <MockIcon {...props} data-testid="arrow-icon" />
}))
vi.mock('igz-controls/images/search.svg?react', () => ({
  default: props => <MockIcon {...props} data-testid="search-icon" />
}))
vi.mock('igz-controls/images/exclamation-mark.svg?react', () => ({
  default: props => <MockIcon {...props} data-testid="invalid-icon" />
}))

vi.mock('igz-controls/components', () => ({
  Tooltip: ({ children, template }) => (
    <div data-testid="tooltip">
      {template}
      {children}
    </div>
  ),
  TextTooltipTemplate: ({ text }) => <span data-testid="tooltip-text">{text}</span>,
  RoundedIcon: () => <div data-testid="rounded-icon" />
}))

describe('Combobox Integration Tests', () => {
  const defaultProps = {
    comboboxClassName: 'test-combobox',
    matches: [
      { id: MODELS_PAGE, label: 'Models' },
      { id: DATASETS_PAGE, label: 'Datasets' }
    ],
    selectDropdownList: [
      { id: 'page', label: 'Page', className: 'page-icon' },
      { id: 'tab', label: 'Tab', className: 'tab-icon' }
    ],
    inputOnChange: vi.fn(),
    selectOnChange: vi.fn(),
    inputDefaultValue: '',
    selectDefaultValue: { label: '', id: '', className: '' },
    inputPlaceholder: 'Type here...',
    selectPlaceholder: 'Select Category',
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    required: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with initial state', () => {
    render(<Combobox {...defaultProps} />)

    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
    expect(screen.getByText('Select Category')).toBeInTheDocument()
  })

  it('opens select dropdown and selects an option', () => {
    const { container } = render(<Combobox {...defaultProps} />)

    const selectHeader = container.querySelector('.combobox-select__header')

    fireEvent.click(selectHeader)

    const selectContainer = container.querySelector('.combobox-select')
    expect(selectContainer).toHaveClass('combobox-select_open')

    const optionPage = screen.getByText('Page')
    fireEvent.click(optionPage)

    expect(defaultProps.selectOnChange).toHaveBeenCalledWith('page')
    expect(selectContainer).not.toHaveClass('combobox-select_open')
    expect(screen.getByText('page')).toBeInTheDocument()
  })

  it('updates input, shows matches, and handles match selection logic', () => {
    const { container } = render(<Combobox {...defaultProps} />)
    const input = screen.getByPlaceholderText('Type here...')

    fireEvent.change(input, { target: { value: 'cp' } })

    expect(defaultProps.inputOnChange).toHaveBeenCalledWith('cp')

    const dropdown = container.querySelector('.combobox-dropdown')
    expect(dropdown).toHaveClass('combobox-dropdown_visible')

    expect(screen.getByText('Models')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Models'))
  })

  it('appends slash when selecting match if logic allows', () => {
    render(<Combobox {...defaultProps} maxSuggestedMatches={2} />)
    const input = screen.getByPlaceholderText('Type here...')

    fireEvent.change(input, { target: { value: 'cp' } })

    fireEvent.click(screen.getByText('Models'))

    expect(defaultProps.inputOnChange).toHaveBeenCalledWith('models/')
  })

  it('filters matches using the internal search input', () => {
    const testMatches = [
      { id: 'models', label: 'Models' },
      { id: 'datasets', label: 'Datasets' }
    ]

    render(<Combobox {...defaultProps} matches={testMatches} hideSearchInput={false} />)

    const mainInput = screen.getByPlaceholderText('Type here...')

    fireEvent.focus(mainInput)

    const searchInput = screen.getByPlaceholderText('Type to search')
    expect(searchInput).toBeInTheDocument()

    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'data' } })

    waitFor(() => {
      expect(screen.queryByText('Models')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Datasets')).toBeInTheDocument()
  })

  it('validates required field on outside click (blur)', async () => {
    const TestWrapper = () => {
      const [isInvalid, setIsInvalid] = useState(false)

      const handleOnBlur = value => {
        if (!value) {
          setIsInvalid(true)
        }
      }

      return (
        <Combobox
          {...defaultProps}
          required={true}
          requiredText="Field is required"
          invalid={isInvalid}
          onBlur={(id, val) => handleOnBlur(val)}
        />
      )
    }

    const { container } = render(<TestWrapper />)

    const input = screen.getByPlaceholderText('Type here...')

    fireEvent.focus(input)

    await waitFor(() => {
      expect(container.querySelector('.combobox-dropdown')).toHaveClass('combobox-dropdown_visible')
    })

    fireEvent.click(document.body)

    await waitFor(() => {
      expect(container.querySelector('.combobox')).toHaveClass('combobox_invalid')
    })
  })

  it('disables input if selectValue is empty', () => {
    render(<Combobox {...defaultProps} selectDefaultValue={{ id: '', label: '' }} />)

    const input = screen.getByPlaceholderText('Type here...')
    expect(input).toBeDisabled()
  })

  it('enables input when category is selected', () => {
    render(<Combobox {...defaultProps} selectDefaultValue={{ id: 'page', label: 'Page' }} />)

    const input = screen.getByPlaceholderText('Type here...')
    expect(input).not.toBeDisabled()
  })
})
