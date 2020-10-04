import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import Accordion from './Accordion'

const renderComponent = props => render(<Accordion {...props} />)

describe('Accordion component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      closeOnBlur: jest.fn(),
      icon: <accrodin-icon />
    }

    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('accordion')).not.toBeNull()
  })

  it('should add class "open" if click by button', () => {
    const accordion = wrapper.getByTestId('accordion')
    const accordionBtn = wrapper.getByTestId('accordion-btn')

    fireEvent.click(accordionBtn)

    expect(accordion.className).toMatch('open')
  })

  it('should remove class "open" if click outside accordion', () => {
    const accordion = wrapper.getByTestId('accordion')

    fireEvent.click(wrapper.container)

    expect(accordion.className).not.toMatch('open')
  })

  it('should add class "open" accordion body if props icon empty', () => {
    wrapper.rerender(<Accordion />)

    const accordion = wrapper.getByTestId('accordion')

    fireEvent.click(accordion)

    expect(accordion.className).toMatch('open')
  })
})
