import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import DatePicker from './DatePicker'

jest.mock('igz-controls/images/back-arrow.svg', () => ({
  ReactComponent: 'arrow-icon'
}))

describe('DatePicker component', () => {
  let wrapper
  const mockOnChange = jest.fn()

  beforeEach(() => {
    const props = {
      value: new Date('12.10.2020'),
      onChange: mockOnChange,
      splitCharacter: '.'
    }

    wrapper = render(<DatePicker {...props} />)
  })

  afterEach(() => {
    cleanup()
    Element.prototype.getBoundingClientRect = () => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    })
  })

  it('renders without crashing', () => {
    const datePicker = wrapper.queryByTestId('date-picker-container')

    expect(datePicker).not.toBeNull()
  })

  it('should open the calendar if click on the input', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const calendar = wrapper.queryByTestId('date-picker-calendar')

    expect(calendar).not.toBeNull()
  })

  it('should hide calendar if click outside the calendar', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    fireEvent.click(wrapper.container)

    const calendar = wrapper.queryByTestId('date-picker-calendar')

    expect(calendar).toBeNull()
  })

  it('should display datepicker calendar on the top', () => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 8.34375,
        height: 17,
        top: 967.046875,
        right: 860.015625,
        bottom: 984.046875,
        left: 851.671875
      }
    })

    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const calendar = wrapper.queryByTestId('date-picker-calendar')

    expect(calendar.className).toMatch('positionTop')
  })

  it('should display previous month in calendar', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const btnPreviousMonth = wrapper.getByTestId('btn-previous-month')

    fireEvent.click(btnPreviousMonth)

    const month = wrapper.queryByText(/November/i)

    expect(month.textContent).toEqual('November')
  })

  it('should display next month in calendar', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const btnNextMonth = wrapper.getByTestId('btn-next-month')

    fireEvent.click(btnNextMonth)

    const month = wrapper.queryByText(/January/i)

    expect(month.textContent).toEqual('January')
  })

  it('should call "onChange" handler if click by button apply', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const btnApply = wrapper.getByTestId('btn-apply')

    fireEvent.click(btnApply)

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should change value if user select some day', () => {
    const input = wrapper.getByTestId('date-picker-input')

    fireEvent.click(input)

    const selectedDay = wrapper.queryByText(/15/i)

    fireEvent.click(selectedDay)

    const btnApply = wrapper.getByTestId('btn-apply')

    fireEvent.click(btnApply)

    const maskInput = wrapper.container.querySelector('input')

    expect(maskInput.value).toEqual('12.15.2020')
  })

  it('should change value of input to "12.25.2020"', () => {
    const inputMask = wrapper.container.querySelector('input')

    fireEvent.change(inputMask, { target: { value: '12.25.2020' } })

    expect(inputMask.value).toEqual('12.25.2020')
  })

  it('should call React.memo if render second time', () => {
    wrapper.rerender(
      <DatePicker
        value={new Date('12.10.2020')}
        onChange={jest.fn()}
        splitCharacter="."
      />
    )
    const inputMask = wrapper.container.querySelector('input')

    expect(inputMask.value).toEqual('12.10.2020')
  })

  it('should datepicker input empty if props value is empty', () => {
    wrapper.rerender(
      <DatePicker value={''} onChange={jest.fn()} splitCharacter="." />
    )

    const input = wrapper.container.querySelector('input')

    expect(input.value).toEqual('')
  })
})
