import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'

const ProjectArtifacts = ({ counterValue, link, projectCounters, title }) => {
  return (
    <Link to={link} className="project-data-card project-data-card_small">
      <div className="project-data-card__header">
        <div className="project-data-card__header-text data-ellipsis">
          {title}
        </div>
        <div className="project-data-card__statistics">
          <div className="project-data-card__statistics-item">
            {projectCounters.loading ? (
              <Loader section />
            ) : (
              <div className="project-data-card__statistics-value statistics_default">
                {projectCounters.error ? 'N/A' : counterValue}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

ProjectArtifacts.propTypes = {
  counterValue: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  projectCounters: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default ProjectArtifacts
