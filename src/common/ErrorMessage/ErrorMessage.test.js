import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import ErrorMessage from './ErrorMessage'

jest.mock('../../images/unsuccess_alert.svg', () => ({
  ReactComponent: 'unsuccess_alert-icon'
}))

jest.mock('../../images/close.svg', () => ({
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
