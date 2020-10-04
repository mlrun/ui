import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import PopUpDialog from './PopUpDialog'

jest.mock('../../images/close.svg', () => ({
  ReactComponent: 'close-icon'
}))

const renderComponent = props => render(<PopUpDialog {...props} />)

describe('PopUpDialog component', () => {
  let wrapper
  const mockClosePopUp = jest.fn()

  beforeEach(() => {
    const props = {
      closePopUp: mockClosePopUp,
      headerText: 'Artifacts'
    }

    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('pop-up-dialog')).not.toBeNull()
  })

  it('should display header if props "headerTest" is not empty', () => {
    expect(wrapper.queryByTestId('pop-up-dialog-header')).not.toBeNull()
  })

  it('should call "closePopUp" handler if click by close icon', () => {
    const closeBtn = wrapper.getByTestId('pop-up-close-btn')
    fireEvent.click(closeBtn)
    expect(mockClosePopUp).toHaveBeenCalled()
  })
})
