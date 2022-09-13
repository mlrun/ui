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
