import {
  cleanup,
  fireEvent,
  render,
  waitForElementToBeRemoved
} from '@testing-library/react'
import React from 'react'
import Tooltip from './Tooltip'

const renderComponent = props =>
  render(
    <Tooltip {...props}>
      <div>tooltip</div>
    </Tooltip>
  )

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height
  }).dispatchEvent(new this.Event('resize'))
}

describe('Tooltip', () => {
  let wrapper
  beforeEach(() => {
    const props = {
      template: <div>It's tooltip</div>
    }
    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('tooltip-wrapper')).not.toBeNull()
  })

  it('should hide tooltip while scrolling', async () => {
    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.getByTestId('tooltip')

    expect(tooltip).not.toBeNull()

    fireEvent.scroll(window)

    const removeTooltip = await waitForElementToBeRemoved(
      wrapper.getByTestId('tooltip')
    )
    expect(removeTooltip).toBeUndefined()
  })

  it('should hide tooltip when mouse leave', async () => {
    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.getByTestId('tooltip')

    expect(tooltip).not.toBeNull()

    fireEvent.mouseLeave(tooltipWrapper)

    const removeTooltip = await waitForElementToBeRemoved(
      wrapper.getByTestId('tooltip')
    )
    expect(removeTooltip).toBeUndefined()
  })

  it('should show tooltip on the top', () => {
    window.resizeTo(800, 10)

    wrapper.rerender(
      <Tooltip template={<div>It's tooltip 123</div>}>
        <div>tooltip</div>
      </Tooltip>
    )
    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.getByTestId('tooltip')

    expect(tooltip.style.top).toBe('-10px')
  })

  it('should always show tooltip if textShow set to "true"', () => {
    wrapper.rerender(
      <Tooltip template={<div>It's tooltip 123</div>} textShow={true}>
        tooltip
      </Tooltip>
    )

    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.getByTestId('tooltip')

    expect(tooltip).not.toBeNull()
  })

  it('should not show tooltip if children is empty', () => {
    const children = null
    wrapper.rerender(
      <Tooltip template={<div>tooltip</div>}>{children}</Tooltip>
    )

    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.queryByTestId('tooltip')

    expect(tooltip).toBeNull()
  })

  it('should show tooltip if children is a "Node"', () => {
    const children = <div>children</div>
    wrapper.rerender(
      <Tooltip template={<div>tooltip</div>}>{children}</Tooltip>
    )

    const tooltipWrapper = wrapper.getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(tooltipWrapper)

    const tooltip = wrapper.queryByTestId('tooltip')

    expect(tooltip).not.toBeNull()
  })
})
