import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

const ProjectStatisticsCounter = ({ counterObject }) => {
  const dataCardStatisticsValueClassNames = classnames(
    'project-data-card__statistics-value',
    `statistics_${counterObject.className}`,
    typeof counterObject.value !== 'number' &&
      'project-data-card__statistics-value_not-available'
  )

  return counterObject.counterTooltip ? (
    <Tooltip
      template={<TextTooltipTemplate text={counterObject.counterTooltip} />}
      textShow
    >
      <div
        className={`project-data-card__statistics-value statistics_${counterObject.className}`}
      >
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
      <div
        key={counterObject.value + Math.random()}
        className={dataCardStatisticsValueClassNames}
      >
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
