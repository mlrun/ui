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
