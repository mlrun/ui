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
import { render, cleanup } from '@testing-library/react'
import YamlModal from './YamlModal'

jest.mock('igz-controls/images/close.svg', () => ({
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
