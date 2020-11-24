import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ProjectStatisticsCounter from '../ProjectStatisticsCounter/ProjectStatisticsCounter'

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
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </a>
        ) : statistics[key].link ? (
          <Link
            className="project-data-card__statistics-link"
            to={statistics[key].link}
          >
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </Link>
        ) : (
          <div className="project-data-card__statistics-data">
            <ProjectStatisticsCounter counterObject={statistics[key]} />
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
