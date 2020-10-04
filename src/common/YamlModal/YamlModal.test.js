import React from 'react'
import { render, cleanup } from '@testing-library/react'
import YamlModal from './YamlModal'

jest.mock('../../images/close.svg', () => ({
  ReactComponent: 'close-icon'
}))

describe('YamlModal component', () => {
  let wrapper

  const renderComponent = props => render(<YamlModal {...props} />)

  beforeEach(() => {
    const props = {
      convertedYaml: `
    - martin:
      name: Martin Newman
      job: Developer
      skills:
        - python
        - perl
        - pascal
    - tabitha:
      name: Tabitha Bitumen
      job: Developer
      skills:
        - lisp
        - fortran
        - erlang
      `,
      toggleConvertToYaml: jest.fn()
    }

    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing ', () => {
    expect(wrapper.queryByTestId('yaml-modal')).not.toBeNull()
  })

  it('should display text as "pascal"', () => {
    expect(wrapper.getByText(/pascal/i)).toBeTruthy()
  })

  it('should remove class "modal-showed" if convertedYaml is empty', () => {
    wrapper.rerender(
      <YamlModal convertedYaml="" toggleConvertToYaml={jest.fn()} />
    )

    const yaml = wrapper.getByTestId('yaml-modal')

    expect(yaml.className).not.toMatch('modal-showed')
  })
})
