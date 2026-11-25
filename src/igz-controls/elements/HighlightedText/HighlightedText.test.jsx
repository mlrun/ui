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
import { describe, it, expect } from 'vitest'
import HighlightedText from './HighlightedText'

describe('HighlightedText', () => {
  it('wraps every case-insensitive match in <b>', () => {
    const { container } = render(<HighlightedText text="Foo bar foo" highlight="foo" />)

    expect(container.innerHTML).toBe('<b>Foo</b> bar <b>foo</b>')
  })

  it('renders the text unchanged when highlight is empty', () => {
    const { container } = render(<HighlightedText text="Foo" />)

    expect(container.innerHTML).toBe('Foo')
  })

  it('renders HTML in the text as plain text', () => {
    const { container } = render(
      <HighlightedText text="<img src=x onerror=alert(1)>" highlight="img" />
    )

    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toBe('<img src=x onerror=alert(1)>')
  })

  it('treats regex special characters in highlight literally', () => {
    const { container } = render(<HighlightedText text="a (b) c" highlight="(b" />)

    expect(container.innerHTML).toBe('a <b>(b</b>) c')
  })
})
