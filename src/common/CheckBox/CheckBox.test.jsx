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
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CheckBox from './CheckBox'

vi.mock('igz-controls/images/checkbox-unchecked.svg?react', () => ({
  default: (props) => <svg data-testid="unchecked-icon" {...props} />
}))

vi.mock('igz-controls/images/checkbox-checked.svg?react', () => ({
  default: (props) => <svg data-testid="checked-icon" {...props} />
}))

describe('CheckBox Component', () => {
  const defaultProps = {
    item: { id: 'item-1', label: 'Test Label' },
    onChange: vi.fn(),
    selectedId: ''
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    render(<CheckBox {...defaultProps} />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByTestId('unchecked-icon')).toBeInTheDocument()
    expect(screen.getByTestId('unchecked-icon')).toHaveClass('unchecked')
    expect(screen.queryByTestId('checked-icon')).not.toBeInTheDocument()
  })

  it('renders as checked when selectedId matches item.id', () => {
    render(<CheckBox {...defaultProps} selectedId="item-1" />)

    expect(screen.getByTestId('checked-icon')).toBeInTheDocument()
    expect(screen.getByTestId('checked-icon')).toHaveClass('checked')
    expect(screen.queryByTestId('unchecked-icon')).not.toBeInTheDocument()
  })

  it('calls onChange with item.id when clicked', () => {
    render(<CheckBox {...defaultProps} />)

    fireEvent.click(screen.getByText('Test Label'))

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onChange).toHaveBeenCalledWith('item-1')
  })

  it('renders custom children instead of item.label', () => {
    render(
      <CheckBox {...defaultProps}>
        <span data-testid="custom-child">Custom Content</span>
      </CheckBox>
    )

    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('applies correct classes and does not trigger onChange when disabled', () => {
    render(<CheckBox {...defaultProps} disabled={true} className="custom-class" />)

    const containerSpan = screen.getByText('Test Label').closest('span')

    expect(containerSpan).toHaveClass('checkbox')
    expect(containerSpan).toHaveClass('checkbox_disabled')
    expect(containerSpan).toHaveClass('custom-class')

    fireEvent.click(containerSpan)

    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })
})
