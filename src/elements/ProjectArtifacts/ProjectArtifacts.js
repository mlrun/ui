import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProjectArtifacts = ({ link, projectCounter, projectCounters, title }) => {
  return (
    <Link to={link} className="project-data-card project-data-card_small">
      <div className="project-data-card__header">
        <div className="project-data-card__header-text data-ellipsis">
          {title}
        </div>
        {projectCounters.error ? (
          <div className="error-container">
            <h1>{projectCounters.error}</h1>
          </div>
        ) : (
          <div className="project-data-card__statistics">
            <div className="project-data-card__statistics-item">
              <div className="project-data-card__statistics-value statistics_default">
                {projectCounter}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

ProjectArtifacts.propTypes = {
  link: PropTypes.string.isRequired,
  projectCounter: PropTypes.number.isRequired,
  projectCounters: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default ProjectArtifacts
