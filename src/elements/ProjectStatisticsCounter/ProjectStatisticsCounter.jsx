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
import React, { useId, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isNil } from 'lodash'

import { Tooltip, TextTooltipTemplate, Loader } from 'igz-controls/components'

import Arrow from 'igz-controls/images/arrow.svg?react'

const ProjectStatisticsCounter = ({ counterObject }) => {
  const MAX_VISIBLE_COUNTER = 999999
  const dataCardStatisticsValueClassNames = classnames(
    'project-data-card__statistics-value',
    `statistics_${counterObject.className}`,
    typeof counterObject.value !== 'number' && 'project-data-card__statistics-value_not-available'
  )
  const uniqueId = useId()

  const generatedCountersContent = useMemo(() => {
    if (!isNil(counterObject.value) && isFinite(Number(counterObject.value))) {
      const displayValue = counterObject.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      if (Number(counterObject.value) < MAX_VISIBLE_COUNTER) {
        return {
          value: displayValue
        }
      }

      const truncatedValue = Math.floor(counterObject.value / 100000) / 10

      return {
        value: (truncatedValue % 1 === 0 ? Math.floor(truncatedValue) : truncatedValue) + 'M',
        tooltip: ` (${displayValue})`
      }
    }

    return {
      value: counterObject.value
    }
  }, [counterObject.value])

  return counterObject.counterTooltip ? (
    <Tooltip template={<TextTooltipTemplate text={counterObject.counterTooltip} />} textShow>
      <div className={dataCardStatisticsValueClassNames}>
        {counterObject.loading ? (
          <Loader section small secondary />
        ) : (
          <>
            {generatedCountersContent.value ?? 'N/A'}
            <Arrow className="project-data-card__statistics-arrow" />
          </>
        )}
      </div>
      <div className="project-data-card__statistics-label">
        <div className="project-data-card__statistics-label">
          <span>{counterObject.label}</span>
          {counterObject.status && <i className={`state-${counterObject.status}`} />}
        </div>
      </div>
    </Tooltip>
  ) : (
    [
      <div
        key={`value-${counterObject.label}-${uniqueId}`}
        className={dataCardStatisticsValueClassNames}
      >
        {counterObject.loading ? (
          <Loader section small secondary />
        ) : (
          <>
            <Tooltip
              textShow={Boolean(generatedCountersContent.tooltip)}
              template={<TextTooltipTemplate text={generatedCountersContent.tooltip} />}
            >
              {generatedCountersContent.value ?? 'N/A'}
            </Tooltip>
            <Arrow className="project-data-card__statistics-arrow" />
          </>
        )}
      </div>,
      <div
        className="project-data-card__statistics-label"
        key={`label-${counterObject.label}-${uniqueId}`}
      >
        <span>{counterObject.label ?? 'N/A'}</span>
        {counterObject.status && <i className={`state-${counterObject.status}`} />}
      </div>
    ]
  )
}

ProjectStatisticsCounter.propTypes = {
  counterObject: PropTypes.object.isRequired
}

export default ProjectStatisticsCounter
