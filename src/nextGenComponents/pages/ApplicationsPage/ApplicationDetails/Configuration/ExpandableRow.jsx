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
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { cn } from 'igz-controls/nextGenComponents'
import { ChevronRight } from 'lucide-react'

const ExpandableRow = ({ row, renderExpanded, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div className="border-b border-igz-gray-light last:border-b-0">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${row.name} details`}
        className="flex items-center w-full py-2.5 pl-1 hover:bg-igz-accent-hover cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        data-testid={`expandable-row-${row.name}`}
      >
        <ChevronRight
          className={cn(
            'w-4 h-4 text-igz-secondary transition-transform duration-200 mr-2 shrink-0',
            isExpanded && 'rotate-90'
          )}
        />
        <div className="flex flex-1 min-w-0">
          {row.cells.map((cell, index) => (
            <span
              key={cell.id}
              className={cn(
                'truncate text-body',
                index === 0 ? 'text-igz-primary font-medium' : 'text-igz-secondary'
              )}
              style={{ flex: cell.flex || 1 }}
              data-testid={`expandable-cell-${row.name}-${cell.id}`}
            >
              {cell.value || ''}
            </span>
          ))}
        </div>
      </button>
      {isExpanded && (
        <div className="pl-7 pb-3 pr-4" data-testid={`expanded-content-${row.name}`}>
          {renderExpanded(row)}
        </div>
      )}
    </div>
  )
}

ExpandableRow.propTypes = {
  defaultExpanded: PropTypes.bool,
  renderExpanded: PropTypes.func.isRequired,
  row: PropTypes.shape({
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        flex: PropTypes.number,
        id: PropTypes.string.isRequired,
        value: PropTypes.string
      })
    ).isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
}

export default ExpandableRow
