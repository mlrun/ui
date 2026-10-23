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

const LEVEL_COLOR = {
  info: 'text-blue-400',
  warn: 'text-yellow-500',
  error: 'text-red-500',
  debug: 'text-purple-400'
}

const REQUIRED_LOG_KEYS = new Set(['level', 'message', 'name', 'time', 'err', 'ui'])

const formatTimestamp = timestamp => {
  const date = new Date(timestamp)

  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

const buildExtrasString = log => {
  const extras = Object.entries(log).filter(([key]) => !REQUIRED_LOG_KEYS.has(key))

  if (extras.length === 0) return null

  return extras
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: ${JSON.stringify(value)}`

      const formatted = typeof value === 'string' ? `"${value}"` : value

      return `${key}: ${formatted}`
    })
    .join(', ')
}

const LogRow = ({ log }) => {
  const { time, level, message } = log
  const timeString = formatTimestamp(time)
  const extrasString = buildExtrasString(log)
  const levelColor = LEVEL_COLOR[level] ?? 'text-gray-400'

  return (
    <div
      className="font-mono text-xs rounded px-1 wrap-break-word leading-relaxed"
      data-testid="log-row"
    >
      <span className="text-gray-500 mr-2 select-none">[{timeString}]</span>
      <span className={`uppercase font-bold mr-2 ${levelColor}`}>{level}</span>
      <span className="text-white">{message}</span>
      {extrasString && <span className="text-gray-500 ml-2">[{extrasString}]</span>}
    </div>
  )
}

LogRow.propTypes = {
  log: PropTypes.shape({
    level: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    name: PropTypes.string,
    time: PropTypes.number.isRequired
  }).isRequired
}

export default LogRow
