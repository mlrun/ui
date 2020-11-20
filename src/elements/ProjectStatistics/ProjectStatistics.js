import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './projectStatistics.scss'

const ProjectStatistics = ({ statistics }) => {
  return Object.keys(statistics).map((key, index) => {
    return (
      <div key={key + index} className="project-data-card__statistics-item">
        {statistics[key].href ? (
          <a
            href={statistics[key].href}
            target="_top"
            className="project-data-card__statistics-link"
          >
            <div
              className={`project-data-card__statistics-value statistics_${statistics[key].className}`}
            >
              {statistics[key].value}
              <Arrow className="project-data-card__statistics-arrow" />
            </div>
            <div className="project-data-card__statistics-label">
              <Tooltip
                template={<TextTooltipTemplate text={statistics[key].label} />}
              >
                {statistics[key].label}
              </Tooltip>
            </div>
          </a>
        ) : statistics[key].link ? (
          <Link
            className="project-data-card__statistics-link"
            to={statistics[key].link}
          >
            <div
              className={`project-data-card__statistics-value statistics_${statistics[key].className}`}
            >
              {statistics[key].value}
              <Arrow className="project-data-card__statistics-arrow" />
            </div>
            <div className="project-data-card__statistics-label">
              <Tooltip
                template={<TextTooltipTemplate text={statistics[key].label} />}
              >
                {statistics[key].label}
              </Tooltip>
            </div>
          </Link>
        ) : (
          <div className="project-data-card__statistics-data">
            <div
              className={`project-data-card__statistics-value statistics_${statistics[key].className}`}
            >
              {statistics[key].value}
              <Arrow className="project-data-card__statistics-arrow" />
            </div>
            <div className="project-data-card__statistics-label">
              <Tooltip
                template={<TextTooltipTemplate text={statistics[key].label} />}
              >
                {statistics[key].label}
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    )
  })
}

ProjectStatistics.propTypes = {
  statistics: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectStatistics)
