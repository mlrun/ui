import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  waitForElementToBeRemoved
} from '@testing-library/react'

import TableActionsMenu from './TableActionsMenu'
import { act } from 'react-dom/test-utils'

jest.mock('../../images/elipsis.svg', () => ({
  ReactComponent: 'action-menu'
}))

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const renderComponent = props => render(<TableActionsMenu {...props} />)

describe('TableActionsMenu component', () => {
  let wrapper
  const mockOnClick = jest.fn()

  beforeEach(() => {
    const props = {
      menu: [
        {
          label: 'View YAML',
          icon: 'yaml-icon',
          onClick: mockOnClick
        }
      ]
    }

    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('actions-menu')).not.toBeNull()
  })

  it('should show the drop-down menu', () => {
    const actionMenuBtn = wrapper.getByTestId('actions-menu-btn')

    fireEvent.click(actionMenuBtn)

    expect(wrapper.queryByTestId('actions-drop-down-menu')).not.toBeNull()
  })

  it('should hide the drop-down menu when mouse leave', async () => {
    const actionMenuBtn = wrapper.getByTestId('actions-menu-btn')
    const actionsMenu = wrapper.getByTestId('actions-menu')

    fireEvent.click(actionMenuBtn)
    fireEvent.mouseLeave(actionsMenu)

    const actionsDropDownMenu = await waitForElementToBeRemoved(
      wrapper.getByTestId('actions-drop-down-menu')
    )

    expect(actionsDropDownMenu).toBeUndefined()
  })

  it('should show the drop-down menu if quickly mouse return', async () => {
    const actionMenuBtn = wrapper.getByTestId('actions-menu-btn')
    const actionsMenu = wrapper.getByTestId('actions-menu')

    fireEvent.click(actionMenuBtn)
    fireEvent.mouseLeave(actionsMenu)

    await act(() => sleep(90))
    fireEvent.mouseEnter(actionsMenu)

    const actionsDropDownMenu = wrapper.getByTestId('actions-drop-down-menu')

    expect(actionsDropDownMenu).not.toBeUndefined()
  })

  it('should close the drop-down menu when select some item', () => {
    const actionMenuBtn = wrapper.getByTestId('actions-menu-btn')

    fireEvent.click(actionMenuBtn)

    const actionsDropDownMenuItem = wrapper.getByTestId('actions-menu-item')

    fireEvent.click(actionsDropDownMenuItem)

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('should close drop-down menu after 100ms', async () => {
    const actionMenuBtn = wrapper.getByTestId('actions-menu-btn')
    const actionsMenu = wrapper.getByTestId('actions-menu')

    fireEvent.click(actionMenuBtn)
    fireEvent.mouseLeave(actionsMenu)

    await act(() => sleep(100))

    const actionsDropDownMenu = wrapper.queryByTestId('actions-drop-down-menu')

    expect(actionsDropDownMenu).toBeNull()
  })
})
