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
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Prism from 'prismjs'
import CodeBlock from './CodeBlock'

vi.mock('prismjs', () => ({
  default: {
    highlight: vi.fn().mockReturnValue('<span class="token">mocked content</span>'),
    languages: {
      json: 'json-grammar',
      javascript: 'javascript-grammar'
    }
  }
}))

describe('CodeBlock Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    const { container } = render(<CodeBlock />)

    expect(container.firstChild).toHaveClass('code-block')
    expect(Prism.highlight).toHaveBeenCalled()
  })

  it('renders label correctly', () => {
    render(<CodeBlock label="Test Label" />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toHaveClass('code-block__label')
  })

  it('applies custom className', () => {
    const { container } = render(<CodeBlock className="custom-class" />)

    expect(container.firstChild).toHaveClass('code-block')
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('calls Prism.highlight with correct arguments (JSON data)', () => {
    const testData = { key: 'value' }
    render(<CodeBlock codeData={testData} language="json" />)

    const expectedString = JSON.stringify(testData, null, 2)

    expect(Prism.highlight).toHaveBeenCalledWith(
      expectedString,
      'json-grammar',
      'json'
    )
  })

  it('renders the highlighted HTML returned by Prism', () => {
    render(<CodeBlock />)

    expect(screen.getByText('mocked content')).toBeInTheDocument()
  })

  it('handles different language prop', () => {
    const testData = { foo: 'bar' }
    render(<CodeBlock codeData={testData} language="javascript" />)

    const expectedString = JSON.stringify(testData, null, 2)

    expect(Prism.highlight).toHaveBeenCalledWith(
      expectedString,
      'javascript-grammar',
      'javascript'
    )
  })
})
