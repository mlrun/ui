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
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

const ProjectStatisticsCounter = ({ counterObject }) => {
  const dataCardStatisticsValueClassNames = classnames(
    'project-data-card__statistics-value',
    `statistics_${counterObject.className}`,
    typeof counterObject.value !== 'number' && 'project-data-card__statistics-value_not-available'
  )

  return counterObject.counterTooltip ? (
    <Tooltip template={<TextTooltipTemplate text={counterObject.counterTooltip} />} textShow>
      <div className={dataCardStatisticsValueClassNames}>
        {counterObject.loading ? (
          <Loader section small secondary />
        ) : (
          <>
            {counterObject.value}
            <Arrow className="project-data-card__statistics-arrow" />
          </>
        )}
      </div>
      <div className="project-data-card__statistics-label">
        <Tooltip
          className={counterObject.labelClassName || ''}
          template={<TextTooltipTemplate text={counterObject.label} />}
        >
          {counterObject.label}
        </Tooltip>
      </div>
    </Tooltip>
  ) : (
    [
      <div key={counterObject.value + Math.random()} className={dataCardStatisticsValueClassNames}>
        {counterObject.loading ? (
          <Loader section small secondary />
        ) : (
          <>
            {counterObject.value}
            <Arrow className="project-data-card__statistics-arrow" />
          </>
        )}
      </div>,
      <div
        className="project-data-card__statistics-label"
        key={counterObject.label + Math.random()}
      >
        {counterObject.label}
      </div>
    ]
  )
}

ProjectStatisticsCounter.propTypes = {
  counterObject: PropTypes.shape({}).isRequired
}

export default ProjectStatisticsCounter
