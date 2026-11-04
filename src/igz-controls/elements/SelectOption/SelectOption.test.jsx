/*
Copyright 2022 Iguazio Systems Ltd.
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
import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import SelectOption from './SelectOption'

describe('SelectOption', () => {
  beforeAll(() => {
    const overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay_container'
    document.body.appendChild(overlayContainer)
  })

  it('highlights matches of the highlight prop in the label', () => {
    const { container } = render(
      <SelectOption name="test" item={{ id: 'a', label: 'my-artifact' }} highlight="art" />
    )

    expect(container.querySelector('b')).toHaveTextContent('art')
  })

  it('renders HTML in the label as plain text', () => {
    const label = '<img src=x onerror=alert(1)>'
    const { container } = render(
      <SelectOption name="test" item={{ id: 'a', label }} highlight="img" />
    )

    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent(label)
  })
})
