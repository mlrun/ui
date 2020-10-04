import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import TimePicker from './TimePicker'

const renderComponent = props => render(<TimePicker {...props} />)

describe('TimePicker component', () => {
  let wrapper
  const mockOnChange = jest.fn()

  beforeEach(() => {
    const props = {
      value: '123',
      onChange: mockOnChange
    }
    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('time-picker')).not.toBeNull()
  })

  it('should change value to "12:35"', () => {
    const timePicker = wrapper.container.querySelector('input')

    fireEvent.change(timePicker, { target: { value: '12:35' } })

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should the first number cannot be bigger than 2', () => {
    const timePicker = wrapper.container.querySelector('input')

    fireEvent.change(timePicker, { target: { value: '22:35' } })

    expect(mockOnChange).toHaveBeenCalledWith('22:35')
  })

  it('should hide labe if props hideLabe is "true"', () => {
    wrapper.rerender(<TimePicker hideLabel value="" onChange={jest.fn()} />)

    expect(wrapper.queryByText('time')).toBeNull()
  })

  it('should not add class "active-input" if props hideLabel exist', () => {
    wrapper.rerender(<TimePicker hideLabel value="123" onChange={jest.fn()} />)

    const timePicker = wrapper.container.querySelector('input')

    expect(timePicker.className).not.toMatch('active-input')
  })
})
