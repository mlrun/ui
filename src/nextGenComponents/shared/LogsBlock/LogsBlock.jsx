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
import PropTypes from 'prop-types'
import { cn } from 'igz-controls/nextGenComponents'

import LogRow from './LogRow'

const TERMINAL_BG = 'bg-[#0c0c0c]'

/**
 * Renders scrollable log content inside a dark terminal area.
 * Fixed height with internal padding. The parent wraps this in a card with
 * its own padding to create space between the card border and this block.
 */
const LogsBlock = ({ logs, isLoading = false }) => {
  const isArray = Array.isArray(logs)
  const hasStructuredLogs = isArray && logs.length > 0
  const isRawString = typeof logs === 'string' && logs.trim().length > 0
  const isEmpty = !hasStructuredLogs && !isRawString

  return (
    <div
      className={cn(
        'rounded-md h-full overflow-y-auto px-2 pt-2 pb-5',
        TERMINAL_BG,
        '[scrollbar-color:rgba(255,255,255,0.2)_transparent]'
      )}
      data-testid="logs-block"
    >
      {hasStructuredLogs ? (
        <div className="flex flex-col gap-0.5">
          {logs.map((log, index) => (
            <LogRow key={`${log.time}-${index}`} log={log} />
          ))}
        </div>
      ) : isRawString ? (
        <pre className="text-white m-0 font-mono text-xs whitespace-pre-wrap leading-5">{logs}</pre>
      ) : isEmpty && !isLoading ? (
        <div
          className="flex items-center justify-center h-full text-white text-sm"
          data-testid="logs-block-empty"
        >
          <span>No data to show</span>
        </div>
      ) : null}
    </div>
  )
}

LogsBlock.propTypes = {
  isLoading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        level: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired
      })
    )
  ])
}

export default LogsBlock
