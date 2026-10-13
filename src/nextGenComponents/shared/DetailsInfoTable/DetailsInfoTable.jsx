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

const EMPTY_VALUE_PLACEHOLDER = ''
const LABEL_WIDTH = 'w-[200px]'

const DetailsInfoTable = ({ className = '', items }) => {
  const visibleItems = (items ?? []).filter(item => !item.hidden)

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2', className)} data-testid="details-info-table">
      {visibleItems.map((item, index) => {
        const itemKey = item.id || (typeof item.label === 'string' ? item.label : index)
        const isLast = index === visibleItems.length - 1

        return (
          <div
            key={itemKey}
            className="flex flex-col gap-2"
            data-testid={item.testId ?? `info-row-${itemKey}`}
          >
            <div className="flex items-baseline pl-1">
              <span
                className={cn(LABEL_WIDTH, 'shrink-0 text-body text-igz-primary')}
                data-testid={`info-label-${itemKey}`}
              >
                {item.label}
              </span>
              <div
                className="flex-1 text-body text-igz-secondary wrap-break-word min-w-0"
                data-testid={`info-value-${itemKey}`}
              >
                {item.value ?? EMPTY_VALUE_PLACEHOLDER}
              </div>
            </div>
            {!isLast && <div className="bg-igz-gray-light h-px w-full" />}
          </div>
        )
      })}
    </div>
  )
}

DetailsInfoTable.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.node.isRequired,
      value: PropTypes.node,
      hidden: PropTypes.bool,
      testId: PropTypes.string
    })
  ).isRequired
}

export default DetailsInfoTable
