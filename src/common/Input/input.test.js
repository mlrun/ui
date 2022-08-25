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
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import Input from './Input'

jest.mock('igz-controls/images/warning.svg', () => ({
  ReactComponent: 'warning-icon'
}))

const renderComponent = props => render(<Input {...props} />)

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
    utils = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(utils.queryByTestId('input')).not.toBeNull()
  })

  it('should set props value to "123"', () => {
    expect(utils.getByTestId('input').value).toEqual('123')
  })

  it('should set props placeholder to "Name"', () => {
    expect(utils.getByTestId('input').placeholder).toEqual('Name')
  })

  it('should set props className to "input-default"', () => {
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

  it('should set props disabled to "true"', () => {
    expect(utils.getByTestId('input').disabled).toEqual(true)
  })

  it('should show label if the props label is not empty', () => {
    expect(utils.queryByTestId('label')).not.toBeNull()
  })

  it('should input active if props focused is "true"', () => {
    cleanup()
    const { getByTestId } = render(<Input type="text" focused={true} />)
    const input = getByTestId('input')

    expect(document.activeElement).toBe(input)
  })

  it('should label has className "active-label"', () => {
    cleanup()
    const { getByTestId } = renderComponent({
      type: 'text',
      label: 'Name',
      floatingLabel: true,
      onChange: jest.fn()
    })
    const input = getByTestId('input')
    const label = getByTestId('label')

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(label.className).not.toMatch('active-label')
  })

  it('should display tip component if props tip is not empty and props required is false', () => {
    expect(utils.queryByTestId('tip')).not.toBeNull()
  })

  it('should display tooltip when cursor over the warning icon', () => {
    cleanup()

    const { getByTestId, queryByTestId } = renderComponent({
      type: 'text',
      required: true,
      requiredText: 'This field is require'
    })

    const warningIcon = getByTestId('tooltip-wrapper')

    fireEvent.mouseEnter(warningIcon)

    const tooltip = queryByTestId('tooltip')

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
    const inputIcon = utils.queryByTestId('input-icon')

    expect(inputIcon).not.toBeNull()
  })
})
