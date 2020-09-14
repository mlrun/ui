import React from 'react'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'

import Input from './Input'

jest.mock('../../images/warning.svg', () => ({
  ReactComponent: 'warning-icon'
}))

describe('Input component', () => {
  const requiredProps = {
    type: 'text'
  }

  const { container, rerender } = render(<Input {...requiredProps} />)

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(container.querySelector('input')).not.toBeNull()
  })

  it('props value set to "123"', () => {
    const props = {
      ...requiredProps,
      value: '123'
    }

    rerender(<Input {...props} />)
    expect(container.querySelector('input').value).toEqual('123')
  })

  it('props placeholder set to "Name"', () => {
    const props = {
      ...requiredProps,
      placeholder: 'Name'
    }

    rerender(<Input {...props} />)
    expect(container.querySelector('input').placeholder).toEqual('Name')
  })

  it('props className set to "input-default"', () => {
    const props = {
      ...requiredProps,
      className: 'input-default'
    }

    rerender(<Input {...props} />)
    expect(container.querySelector('input').className).toMatch('input-default')
  })

  it('should change value to "1243"', () => {
    const props = {
      ...requiredProps,
      value: '123'
    }

    rerender(<Input {...props} />)

    const input = container.querySelector('input')

    expect(input.value).toEqual('123')

    fireEvent.change(input, { target: { value: '1243' } })

    expect(input.value).toEqual('1243')
  })

  it('calls the "onChange" callback handler', () => {
    const mockChange = jest.fn()
    const { container } = render(
      <Input {...requiredProps} onChange={mockChange} />
    )
    const input = container.querySelector('input')

    fireEvent.change(input, { target: { value: '123' } })
    expect(mockChange).toHaveBeenCalled()
  })

  it('props disabled set to "true"', () => {
    const props = {
      ...requiredProps,
      disabled: true
    }
    rerender(<Input {...props} />)

    const input = container.querySelector('input')

    expect(input.disabled).toEqual(true)
  })

  it('should show label if the props label is not empty', () => {
    const props = {
      ...requiredProps,
      label: 'Name'
    }
    rerender(<Input {...props} />)

    const label = container.querySelector('.input__label')

    expect(label).not.toBeNull()
  })

  it('should input in focused if props focused set to "true"', () => {
    const props = {
      ...requiredProps,
      focused: true
    }
    const { container } = render(<Input {...props} />)
    const input = container.querySelector('input')

    expect(document.activeElement).toBe(input)
  })

  it('should show the label on the left in the middle of an input container if the input is empty', () => {
    const props = {
      ...requiredProps,
      label: 'Name',
      floatingLabel: true,
      onChange: jest.fn()
    }
    const { container } = render(<Input {...props} />)
    const input = container.querySelector('input')
    const label = container.querySelector('.input__label')

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(label.className).not.toMatch('active-label')
  })

  it('should display tip component if props tip is not empty and props required is false', () => {
    const props = {
      ...requiredProps,
      tip: 'This field is require',
      required: false
    }

    rerender(<Input {...props} />)

    const tip = container.querySelector('.input__tip')

    expect(tip).not.toBeNull()
  })

  it('should display tooltip when cursor over the warning icon', () => {
    const props = {
      ...requiredProps,
      required: true,
      requiredText: 'This field is require'
    }

    rerender(<Input {...props} />)

    const warningIcon = container.querySelector('.input__warning')

    fireEvent.mouseEnter(warningIcon)

    const tooltip = container.querySelector('.tooltip')

    expect(tooltip).not.toBeNull()
  })

  it('should move the label to the right by 20 pixels if props value is empty', () => {
    const props = {
      ...requiredProps,
      label: 'concurrences',
      value: '',
      infoLabel: true
    }
    rerender(<Input {...props} />)

    const label = container.querySelector('.input__label')

    expect(label.getAttribute('style')).toEqual('left: 20px;')
  })

  it('should move the label to the right by 30 pixels if props value set to "1"', () => {
    const props = {
      ...requiredProps,
      label: 'concurrences',
      infoLabel: true,
      value: '1'
    }

    rerender(<Input {...props} />)

    const label = container.querySelector('.input__label')

    expect(label.getAttribute('style')).toEqual('left: 30px;')
  })

  it('should display inputIcon if props inputIcon is not empty', () => {
    const props = {
      ...requiredProps,
      inputIcon: <>icon</>,
      iconClass: 'input-icon'
    }

    rerender(<Input {...props} />)

    const inputIcon = container.querySelector('.input-icon')

    expect(inputIcon).not.toBeNull()
  })
})
