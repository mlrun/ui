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
import ErrorMessage from './ErrorMessage'

jest.mock('igz-controls/images/unsuccess_alert.svg', () => ({
  ReactComponent: 'unsuccess_alert-icon'
}))

jest.mock('igz-controls/images/close.svg', () => ({
  ReactComponent: 'close-icon'
}))

describe('ErrorMessage component', () => {
  let wrapper
  let mockCloseError = jest.fn()

  beforeEach(() => {
    const props = {
      message: 'Something went wrong',
      closeError: mockCloseError
    }
    wrapper = render(<ErrorMessage {...props} />)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('error-message')).not.toBeNull()
  })

  it('should display message if it not empty', () => {
    const message = wrapper.getByText(/Something went wrong/i)
    expect(message.textContent).toEqual('Something went wrong')
  })

  it('should call "closeError" handler', () => {
    const closeIcon = wrapper.queryByTestId('close')
    fireEvent.click(closeIcon)

    expect(mockCloseError).toHaveBeenCalled()
  })
})
