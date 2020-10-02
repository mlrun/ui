import { render } from '@testing-library/react'
import React from 'react'
import NoData from './NoData'

describe('NoData component', () => {
  it('renders without crashing', () => {
    const { queryByTestId } = render(<NoData />)

    expect(queryByTestId('no-data')).not.toBeNull()
  })
})
