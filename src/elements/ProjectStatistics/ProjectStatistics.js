import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import './projectStatistics.scss'

const ProjectStatistics = ({ statistics }) => {
  return Object.keys(statistics).map((key, index) => {
    return (
      <div key={key + index} className="project-data-card__statistics-item">
        <Link
          className="project-data-card__statistics-link"
          to={statistics[key].link}
        >
          <div
            className={`project-data-card__statistics-value statistics_${statistics[key].className}`}
          >
            {statistics[key].value}
          </div>
          <div className="project-data-card__statistics-label">
            <Tooltip
              template={<TextTooltipTemplate text={statistics[key].label} />}
            >
              {statistics[key].label}
            </Tooltip>
          </div>
        </Link>
      </div>
    )
  })
}

ProjectStatistics.propTypes = {
  statistics: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectStatistics)
