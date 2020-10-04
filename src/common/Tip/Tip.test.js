import React from 'react'
import {
  fireEvent,
  render,
  waitForElementToBeRemoved
} from '@testing-library/react'
import Tip from './Tip'

jest.mock('../../images/question-mark.svg', () => ({
  ReactComponent: 'Question-icon'
}))

const renderComponent = props => render(<Tip {...props} />)

describe('Tip component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      text: 'Show tip component'
    }
    wrapper = renderComponent(props)
  })

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('tip')).not.toBeNull()
  })

  it('should display tip text if mouse over the icon', () => {
    const tipIcon = wrapper.getByTestId('tip-icon')

    fireEvent.mouseEnter(tipIcon)

    expect(wrapper.queryByTestId('tip-text')).not.toBeNull()
  })

  it('should hide tip text if mouse leave the icon', async () => {
    const tipIcon = wrapper.getByTestId('tip-icon')

    fireEvent.mouseEnter(tipIcon)

    expect(wrapper.queryByTestId('tip-text')).not.toBeNull()

    fireEvent.mouseLeave(tipIcon)

    const tipText = await waitForElementToBeRemoved(() =>
      wrapper.queryByTestId('tip-text')
    )

    expect(tipText).toBeUndefined()
  })

  it('should add the class "tip_big" if the length of the prop text is more than 40 characters', () => {
    wrapper.rerender(
      <Tip text="Lorem Ipsum is simply dummy text of the printing and typesetting" />
    )

    const tipIcon = wrapper.getByTestId('tip-icon')

    fireEvent.mouseEnter(tipIcon)

    const tipText = wrapper.getByTestId('tip-text')

    expect(tipText.className).toMatch('tip_big')
  })
})
