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
import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import RangeInput from './RangeInput'

jest.mock('igz-controls/images/range-arrow-small.svg', () => ({
  ReactComponent: 'range-arrow'
}))

describe('RangeInput component', () => {
  afterEach(cleanup)

  it('renders without crashing', () => {
    const { queryByTestId } = render(
      <RangeInput onChange={jest.fn()} value="0" />
    )
    expect(queryByTestId('range-input-container')).not.toBeNull()
  })

  it('should increase value by one', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <RangeInput onChange={mockOnChange} value="0" />
    )
    const btnIncrease = getByTestId('btn-increase')

    fireEvent.click(btnIncrease)
    expect(mockOnChange).toHaveBeenCalledWith(1)
  })

  it('should not value of input will be bigger than props max', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <RangeInput onChange={mockOnChange} value="5" max={5} />
    )
    const btnIncrease = getByTestId('btn-increase')

    fireEvent.click(btnIncrease)

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should decrease value by one', () => {
    const mockOnChange = jest.fn()

    const { getByTestId } = render(
      <RangeInput onChange={mockOnChange} value="3" />
    )

    const btnDecrease = getByTestId('btn-decrease')

    fireEvent.click(btnDecrease)

    expect(mockOnChange).toHaveBeenCalledWith(2)
  })

  it('should not value of input will be smaller than props min', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <RangeInput onChange={mockOnChange} value="5" min={5} />
    )
    const btnIncrease = getByTestId('btn-decrease')

    fireEvent.click(btnIncrease)

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
