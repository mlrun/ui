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
import Tooltip from './Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

describe('Tooltip', () => {
  beforeAll(() => {
    const overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay_container'
    document.body.appendChild(overlayContainer)
  })

  it('highlights matches in string children when highlight is set', () => {
    const { getByTestId } = render(
      <Tooltip highlight="art" template={<TextTooltipTemplate text="my-artifact" />}>
        my-artifact
      </Tooltip>
    )

    expect(getByTestId('tooltip-wrapper').innerHTML).toBe('my-<b>art</b>ifact')
  })

  it('renders children unchanged without highlight', () => {
    const { getByTestId } = render(
      <Tooltip template={<TextTooltipTemplate text="label" />}>
        <span>label</span>
      </Tooltip>
    )

    expect(getByTestId('tooltip-wrapper').innerHTML).toBe('<span>label</span>')
  })

  it('renders HTML in children as plain text', () => {
    const label = '<img src=x onerror=alert(1)>'
    const { getByTestId } = render(
      <Tooltip highlight="img" template={<TextTooltipTemplate text={label} />}>
        {label}
      </Tooltip>
    )

    expect(getByTestId('tooltip-wrapper').querySelector('img')).toBeNull()
    expect(getByTestId('tooltip-wrapper')).toHaveTextContent(label)
  })
})
