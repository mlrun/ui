import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'

const ProjectArtifacts = ({
  artifacts,
  fetchArtifacts,
  link,
  match,
  title
}) => {
  useEffect(() => {
    fetchArtifacts(match.params.projectName)
  }, [fetchArtifacts, match.params.projectName])

  return (
    <Link to={link} className="project-data-card project-data-card_small">
      <div className="project-data-card__header">
        <div className="project-data-card__header-text data-ellipsis">
          {title}
        </div>
        {artifacts.error ? (
          <div className="error_container">
            <h1>{artifacts.error}</h1>
          </div>
        ) : (
          !isEmpty(artifacts.data) && (
            <div className="project-data-card__statistics">
              <div className="project-data-card__statistics-item">
                <div className="project-data-card__statistics-value statistics_default">
                  {artifacts.data.length}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Link>
  )
}

export default ProjectArtifacts
