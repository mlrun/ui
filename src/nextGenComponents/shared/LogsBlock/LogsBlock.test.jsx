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
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import LogsBlock from './LogsBlock'

const LOADING_MSG = 'Build logs will be available once the application is deployed.'

describe('LogsBlock', () => {
  describe('no data', () => {
    it('shows "No data to show" when logs are empty and not loading', () => {
      render(<LogsBlock />)
      expect(screen.getByTestId('logs-block-empty')).toBeInTheDocument()
      expect(screen.getByText('No data to show')).toBeInTheDocument()
    })

    it('shows "No data to show" when logs is an empty array and not loading', () => {
      render(<LogsBlock logs={[]} />)
      expect(screen.getByTestId('logs-block-empty')).toBeInTheDocument()
    })

    it('shows "No data to show" when logs is a blank string and not loading', () => {
      render(<LogsBlock logs="   " />)
      expect(screen.getByTestId('logs-block-empty')).toBeInTheDocument()
    })
  })

  describe('loadingMessage', () => {
    it('shows the loadingMessage inside the block when loading and logs are empty', () => {
      render(<LogsBlock isLoading loadingMessage={LOADING_MSG} />)
      expect(screen.getByTestId('logs-block-loading-message')).toBeInTheDocument()
      expect(screen.getByText(LOADING_MSG)).toBeInTheDocument()
    })

    it('does not show "No data to show" while loading with a loadingMessage', () => {
      render(<LogsBlock isLoading loadingMessage={LOADING_MSG} />)
      expect(screen.queryByTestId('logs-block-empty')).not.toBeInTheDocument()
    })

    it('does not show the loadingMessage when logs are present', () => {
      render(<LogsBlock isLoading logs="some log line" loadingMessage={LOADING_MSG} />)
      expect(screen.queryByTestId('logs-block-loading-message')).not.toBeInTheDocument()
      expect(screen.getByText('some log line')).toBeInTheDocument()
    })

    it('does not show the loadingMessage when not loading', () => {
      render(<LogsBlock loadingMessage={LOADING_MSG} />)
      expect(screen.queryByTestId('logs-block-loading-message')).not.toBeInTheDocument()
      expect(screen.getByTestId('logs-block-empty')).toBeInTheDocument()
    })
  })

  describe('with content', () => {
    it('renders a raw string log', () => {
      render(<LogsBlock logs="Build started successfully" />)
      expect(screen.getByText('Build started successfully')).toBeInTheDocument()
      expect(screen.queryByTestId('logs-block-empty')).not.toBeInTheDocument()
    })

    it('renders structured log entries as LogRow elements', () => {
      const logs = [
        { level: 'info', message: 'Deploying function', time: 1000000000000, name: 'nuclio' }
      ]
      render(<LogsBlock logs={logs} />)
      expect(screen.queryByTestId('logs-block-empty')).not.toBeInTheDocument()
    })
  })
})
