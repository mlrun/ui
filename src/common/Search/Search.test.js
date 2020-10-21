import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import Search from './Search'

jest.mock('../../images/search.svg', () => ({
  ReactComponent: 'search-icon'
}))

describe('Search component', () => {
  let wrapper
  let mockOnChange = jest.fn()

  beforeEach(() => {
    const props = {
      placeholder: 'Search by text, tags and keywords...',
      onChange: mockOnChange,
      matches: [
        'aggregate',
        'arc-to-parquet',
        'concept-drift-steaming',
        'coxph-trainer',
        'describe-dask',
        'feature-perms'
      ]
    }

    wrapper = render(<Search {...props} />)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)
    expect(input).not.toBeNull()
  })

  it('should change value to "arc"', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })

    expect(input.value).toEqual('arc')
  })

  it('should display search list if input in focus and input is not empty', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })

    expect(wrapper.queryByTestId('search-matches')).not.toBeNull()
  })

  it('should select an item if click by one of the search list items', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })

    const searchItem = wrapper.container.querySelector('li+[tabIndex="1"]')

    fireEvent.click(searchItem)

    expect(input.value).toEqual('arc-to-parquet')
  })

  it('should call the "onChange" handler if click by the search icon', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)
    const searchIcon = wrapper.container.querySelector('search-icon')

    fireEvent.change(input, { target: { value: 'arc' } })
    fireEvent.click(searchIcon)

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should call the "onChange" handler if press "Enter"', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })

    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should display the search list if the input in focus and not empty', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })
    fireEvent.click(wrapper.container)
    fireEvent.focus(input)

    expect(wrapper.queryByTestId('search-matches')).not.toBeNull()
  })

  it('should display label', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'arc' } })

    const label = wrapper.container.querySelector('label')

    expect(label.textContent).toEqual('arc-to-parquet')
  })

  it('should no display label if the input value does not start with value in search items', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: '0' } })

    const label = wrapper.container.querySelector('label')

    expect(label).toBeNull()
  })

  it('should hide the label if there are no matches', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'conce' } })

    let label = wrapper.container.querySelector('label')

    expect(label).not.toBeNull()

    fireEvent.change(input, { target: { value: 'oncer' } })

    label = wrapper.container.querySelector('label')

    expect(label).toBeNull()
  })

  it('should hide label if the value of input will be removed', () => {
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'conce' } })

    let label = wrapper.container.querySelector('label')

    expect(label).not.toBeNull()

    fireEvent.change(input, { target: { value: '' } })

    label = wrapper.container.querySelector('label')

    expect(label).toBeNull()
  })

  it('should not display label if props matches is empty', () => {
    wrapper.rerender(
      <Search
        placeholder="Search by text, tags and keywords..."
        onChange={jest.fn()}
      />
    )
    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.change(input, { target: { value: 'conce' } })

    let label = wrapper.container.querySelector('label')

    expect(label).toBeNull()
  })

  it('should not call "onChange" handler if props searchWhileTyping is "true" and input is empty and lick by search icon', () => {
    const mockOnChange = jest.fn()

    wrapper.rerender(
      <Search onChange={mockOnChange} searchWhileTyping={true} />
    )

    const searchIcon = wrapper.container.querySelector('search-icon')

    fireEvent.click(searchIcon)

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should not call "onChange" handler if props searchWhileTyping is "true" and input is empty and press "Enter"', () => {
    const mockOnChange = jest.fn()

    wrapper.rerender(
      <Search
        onChange={mockOnChange}
        searchWhileTyping={true}
        placeholder="Search by text, tags and keywords..."
      />
    )

    const input = wrapper.getByPlaceholderText(/Search by text/i)

    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
