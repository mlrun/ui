import React from 'react'
import { render, fireEvent, cleanup, screen } from '@testing-library/react'

import Input from './Input'

jest.mock('../../images/warning.svg', () => ({
  ReactComponent: 'warning-icon'
}))

const component = props => render(<Input {...props} />)

describe('Input component', () => {
  let utils
  const mockChange = jest.fn()

  beforeEach(() => {
    let props = {
      className: 'input-default',
      disabled: true,
      floatingLabel: true,
      iconClass: 'input-icon',
      inputIcon: <>icon</>,
      label: 'Name',
      onChange: mockChange,
      placeholder: 'Name',
      required: false,
      tip: 'This field is require',
      type: 'text',
      value: '123'
    }
    utils = component(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(utils.getByTestId('input')).not.toBeNull()
  })

  it('should props value set to "123"', () => {
    expect(utils.getByTestId('input').value).toEqual('123')
  })

  it('should props placeholder set to "Name"', () => {
    expect(utils.getByTestId('input').placeholder).toEqual('Name')
  })

  it('should props className set to "input-default"', () => {
    expect(utils.getByTestId('input').className).toMatch('input-default')
  })

  it('should change value to "1243"', () => {
    const value = '1243'
    const input = utils.getByTestId('input')

    fireEvent.change(input, { target: { value } })
    expect(mockChange).toHaveBeenCalled()
    utils.rerender(<Input type="text" value={value} />)
    expect(input.value).toEqual('1243')
  })

  it('should calls the "onChange" callback handler', () => {
    const input = utils.getByTestId('input')

    fireEvent.change(input, { target: { value: '123' } })
    expect(mockChange).toHaveBeenCalled()
  })

  it('should props disabled set to "true"', () => {
    expect(utils.getByTestId('input').disabled).toEqual(true)
  })

  it('should show label if the props label is not empty', () => {
    expect(utils.getByTestId('label')).not.toBeNull()
  })

  it('should input in focused if props focused set to "true"', () => {
    cleanup()
    const { getByTestId } = render(<Input type="text" focused={true} />)
    const input = getByTestId('input')

    expect(document.activeElement).toBe(input)
  })

  it('should show the label on the left in the middle of an input container if the input is empty', () => {
    cleanup()
    const props = {
      type: 'text',
      label: 'Name',
      floatingLabel: true,
      onChange: jest.fn()
    }
    const { getByTestId } = render(<Input {...props} />)
    const input = getByTestId('input')
    const label = getByTestId('label')

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(label.className).not.toMatch('active-label')
  })

  it('should display tip component if props tip is not empty and props required is false', () => {
    expect(utils.getByTestId('tip')).not.toBeNull()
  })

  it('should display tooltip when cursor over the warning icon', () => {
    cleanup()
    const props = {
      type: 'text',
      required: true,
      requiredText: 'This field is require'
    }

    const { getByTestId } = render(<Input {...props} />)

    const warningIcon = getByTestId('hover-element')

    fireEvent.mouseEnter(warningIcon)

    const tooltip = getByTestId('tooltip')

    expect(tooltip).not.toBeNull()
  })

  it('should move the label to the right by 20 pixels if props value is empty', () => {
    const props = {
      type: 'text',
      label: 'concurrences',
      value: '',
      infoLabel: true
    }
    utils.rerender(<Input {...props} />)

    const label = utils.getByTestId('label')

    expect(label.getAttribute('style')).toEqual('left: 20px;')
  })

  it('should move the label to the right by 30 pixels if props value set to "1"', () => {
    const props = {
      type: ' text',
      label: 'concurrences',
      infoLabel: true,
      value: '1'
    }

    utils.rerender(<Input {...props} />)

    const label = utils.getByTestId('label')

    expect(label.getAttribute('style')).toEqual('left: 30px;')
  })

  it('should display inputIcon if props inputIcon is not empty', () => {
    const inputIcon = utils.getByTestId('input-icon')

    expect(inputIcon).not.toBeNull()
  })
})
