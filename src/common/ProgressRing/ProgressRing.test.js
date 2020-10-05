import React from 'react'
import { cleanup, render } from '@testing-library/react'
import ProgressRing from './ProgressRing'

describe('ProgressRing component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      radius: '2',
      stroke: '2',
      progress: 20,
      color: '#581845'
    }
    wrapper = render(<ProgressRing {...props} />)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('progress-ring')).not.toBeNull()
  })
})
