import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

const ProjectStatisticsCounter = ({ counterObject }) => {
  return counterObject.counterTooltip ? (
    <Tooltip
      template={<TextTooltipTemplate text={counterObject.counterTooltip} />}
      textShow
    >
      <div
        className={`project-data-card__statistics-value statistics_${counterObject.className}`}
      >
        {counterObject.loading ? (
          <Loader
            loaderClassName="project-data-card__statistics-loader"
            wrapperClassName="project-data-card__statistics-loader-wrapper"
          />
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
        className={`project-data-card__statistics-value statistics_${counterObject.className}`}
      >
        {counterObject.loading ? (
          <Loader
            loaderClassName="project-data-card__statistics-loader"
            wrapperClassName="project-data-card__statistics-loader-wrapper"
          />
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
        <Tooltip
          className={counterObject.labelClassName || ''}
          template={<TextTooltipTemplate text={counterObject.label} />}
        >
          {counterObject.label}
        </Tooltip>
      </div>
    ]
  )
}

ProjectStatisticsCounter.propTypes = {
  counterObject: PropTypes.shape({}).isRequired
}

export default ProjectStatisticsCounter
