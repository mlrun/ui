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
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import Accordion from './Accordion'

vi.mock('igz-controls/components', () => ({
  RoundedIcon: (props) => <button data-testid="accordion-btn" {...props} />
}))

describe('Accordion Component', () => {
  const defaultChildren = <div data-testid="content">Accordion Content</div>

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders closed by default', () => {
    render(<Accordion>{defaultChildren}</Accordion>)

    const accordion = screen.getByTestId('accordion')

    expect(accordion).toHaveClass('accordion__container')
    expect(accordion).not.toHaveClass('open')
    expect(screen.getByText('Accordion Content')).toBeInTheDocument()
  })

  it('renders opened when openByDefault is true', () => {
    render(<Accordion openByDefault>{defaultChildren}</Accordion>)

    const accordion = screen.getByTestId('accordion')
    expect(accordion).toHaveClass('open')
  })

  it('toggles state when clicking the container if no icon is provided', () => {
    render(<Accordion>{defaultChildren}</Accordion>)

    const accordion = screen.getByTestId('accordion')

    fireEvent.click(accordion)
    expect(accordion).toHaveClass('open')

    fireEvent.click(accordion)
    expect(accordion).not.toHaveClass('open')
  })

  it('does not toggle state when clicking container if icon is provided', () => {
    render(<Accordion icon={<span>Icon</span>}>{defaultChildren}</Accordion>)

    const accordion = screen.getByTestId('accordion')

    fireEvent.click(accordion)
    expect(accordion).not.toHaveClass('open')
  })

  it('toggles state when clicking the icon', () => {
    render(
      <Accordion icon={<span>MY ICON</span>} iconClassName="custom-icon-class">
        {defaultChildren}
      </Accordion>
    )

    const accordion = screen.getByTestId('accordion')
    const iconBtn = screen.getByTestId('accordion-btn')

    expect(iconBtn).toHaveClass('accordion__icon')
    expect(iconBtn).toHaveClass('custom-icon-class')

    fireEvent.click(iconBtn)
    expect(accordion).toHaveClass('open')
    expect(iconBtn).toHaveClass('open')

    fireEvent.click(iconBtn)
    expect(accordion).not.toHaveClass('open')
  })

  it('does not close if alwaysOpened prop is true', () => {
    render(<Accordion alwaysOpened openByDefault>{defaultChildren}</Accordion>)

    const accordion = screen.getByTestId('accordion')
    expect(accordion).toHaveClass('open')

    fireEvent.click(accordion)

    expect(accordion).toHaveClass('open')
  })

  it('handles closeOnBlur (clicking outside)', () => {
    const mockCloseOnBlur = vi.fn()

    render(
      <Accordion
        openByDefault={true}
        closeOnBlur={mockCloseOnBlur}
      >
        {defaultChildren}
      </Accordion>
    )

    const accordion = screen.getByTestId('accordion')
    expect(accordion).toHaveClass('open')

    fireEvent.click(document.body)

    expect(accordion).not.toHaveClass('open')
    expect(mockCloseOnBlur).toHaveBeenCalledTimes(1)
  })
})
